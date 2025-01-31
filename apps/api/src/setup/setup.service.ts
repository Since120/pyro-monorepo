// apps/api/src/setup/setup.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { SetupChannels } from '@prisma/client';

@Injectable()
export class SetupService {
  constructor(private prisma: PrismaService) {}

  /**
   * 1) Prüfen, ob es schon SetupChannels-Eintrag für categoryId gibt
   * 2) Wenn nicht, lege Textkanal an (Bot-Call)
   * 3) Sende erste Embed mit dem "Setup"-Button
   * 4) Speichere die Kanal-ID und ggf. die Nachricht-ID in SetupChannels
   */
  async activateSetup(categoryId: string): Promise<SetupChannels> {
    // (A) Check category exist
    const cat = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    }

    // (B) Check if SetupChannels already exist
    let existing = await this.prisma.setupChannels.findFirst({ where: { categoryId } });
    if (existing) {
      // Optional: Refresh? or do nothing
      return existing;
    }

    // (C) Bot => Erstelle TextChannel
    const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
    // Wir bauen den Channel-Namen und ob er Private sein soll
    const channelName = `SETUP-${cat.name}`.toUpperCase();
    let createdChannelId: string | null = null;

    try {
      const resp = await axios.post(`${botUrl}/discord/text-channels`, {
        channelName,
        parentCategoryId: cat.discordCategoryId, // optional, falls du es in der gleichen Kategorie willst
        private: true, // z.B. nur Admins
      });
      createdChannelId = resp.data.discordChannelId;
    } catch (error) {
      throw new HttpException(
        'Fehler beim Erstellen des Textkanals im Bot',
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!createdChannelId) {
      throw new HttpException(
        'Bot hat keine channelId zurückgeliefert',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

        // (C2) Bot => Erstelle Voice-Kanal (Warteraum)
    // Achtung: Endpunkt /discord/voice-channels erwartet "categoryId" und "channelName"
    // => Wir verwenden cat.discordCategoryId als "categoryId"
    // => z.B. WARTERAUM-KATEGORIE
    let createdVoiceId: string | null = null;
    try {
      const vcResp = await axios.post(`${botUrl}/discord/voice-channels`, {
        channelName: `WARTERAUM-${cat.name}`.toUpperCase(),
        categoryId: cat.discordCategoryId,  // Muss so heißen (nicht parentCategoryId!)
      });
      createdVoiceId = vcResp.data.discordChannelId;
    } catch (error) {
      throw new HttpException(
        'Fehler beim Erstellen des Voice-Warteraums im Bot',
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!createdVoiceId) {
      throw new HttpException(
        'Bot hat keine voiceChannelId zurückgeliefert',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }


    // (D) Bot => Sende eine Embed-Nachricht mit Button "Setup"
    let messageId: string | null = null;
    try {
      const embedResp = await axios.post(`${botUrl}/discord/messages`, {
        channelId: createdChannelId,
        embed: {
          title: 'Kategorie-Setup',
          description: 'Klicke auf den Button, um das Setup zu starten.',
        },
        components: [
          {
            type: 'button',
            label: 'Setup',
            style: 'primary',
            customId: `wizard:start:${cat.id}`, // => wizard:start:CATID
          },
        ],
      });
      messageId = embedResp.data.messageId;
    } catch (error) {
      throw new HttpException(
        'Fehler beim Senden der Setup-Nachricht',
        HttpStatus.BAD_GATEWAY,
      );
    }

    // (E) SetupChannels in DB anlegen
    const newSetup = await this.prisma.setupChannels.create({
      data: {
        categoryId: cat.id,
        textChannelId: createdChannelId,
        voiceChannelId: createdVoiceId,
        embedMessageId: messageId || undefined,
      },
    });

    return newSetup;
  }

    /**
     * Löscht die erstellten Setup-Kanäle (Text + Voice)
     * und entfernt den DB-Eintrag in setupChannels.
     */
    async deactivateSetup(categoryId: string): Promise<void> {
      // 1) Eintrag suchen
      const sc = await this.prisma.setupChannels.findFirst({
        where: { categoryId },
      });
      if (!sc) {
        // Kein Setup für diese Kategorie => nichts zu tun
        return;
      }
  
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
  
      // 2) TextChannel entfernen, falls vorhanden
      if (sc.textChannelId) {
        try {
          await axios.delete(`${botUrl}/discord/text-channels/${sc.textChannelId}`);
          // Du hast noch keinen "DELETE /discord/text-channels/:id" Endpoint?
          // Dann könntest du  "voice-channels" Endpoint klonen 
          // und analog "type=GuildText" löschen.
        } catch (err) {
          console.warn('Fehler beim Löschen des Setup-TextChannels:', err);
        }
      }
  
      // 3) VoiceChannel entfernen, falls vorhanden
      if (sc.voiceChannelId) {
        try {
          await axios.delete(`${botUrl}/discord/voice-channels/${sc.voiceChannelId}`);
        } catch (err) {
          console.warn('Fehler beim Löschen des Setup-VoiceChannels:', err);
        }
      }
  
      // 4) DB-Eintrag löschen
      await this.prisma.setupChannels.delete({
        where: { id: sc.id },
      });
    }
}
