// apps/api/src/categories/categories.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { SetupService } from '../setup/setup.service'; 


@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService, private setupService: SetupService,) {}

  // -------------------------------------
  // 1) Nur Lesen
  // -------------------------------------
  findAll() {
    // Standard: Zeigt alle Categories inkl. deletedInDiscord usw.
    // Falls du sie filtern willst (z. B. nur "deletedInDiscord = false"), 
    // könntest du hier "where: { deletedInDiscord: false }" ergänzen.
    return this.prisma.category.findMany();
  }

  // -------------------------------------
  // 2) CREATE
  // -------------------------------------
  async createCategory(data: {
    name: string;
    categoryType: string;
    isVisible?: boolean;
    allowedRoles?: string[];
    trackingActive?: boolean;
    sendSetup?: boolean;
  }) {
    // (A) DB => create
    const newCat = await this.prisma.category.create({
      data: {
        name: data.name,
        categoryType: data.categoryType,
        isVisible: data.isVisible ?? true,
        allowedRoles: data.allowedRoles ?? [],
        trackingActive: data.trackingActive ?? false,
        sendSetup: data.sendSetup ?? false,
      },
    });

    // (B) Bot => POST /discord/categories
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const response = await axios.post(`${botUrl}/discord/categories`, {
        name: newCat.name,
        isVisible: newCat.isVisible,
        allowedRoles: newCat.allowedRoles,
      });
      const { discordChannelId } = response.data;

      if (!discordChannelId) {
        throw new Error('No channelId returned');
      }

      // (C) DB => update discordCategoryId
      const finalCat = await this.prisma.category.update({
        where: { id: newCat.id },
        data: { discordCategoryId: discordChannelId },
      });

      // (D) Wenn sendSetup = true => Setup aktivieren
      if (finalCat.sendSetup === true) {
        try {
          // Hier direkt den SetupService aufrufen:
          await this.setupService.activateSetup(finalCat.id);
          // Optional: Falls du bei Fehlern nicht abbrechen willst, 
          //   kannst du das in einen try/catch packen und nur warnen.
          } catch (err) {
            console.error('Fehler bei setupService.activateSetup:', err);
            // Falls du den Fehler werfen willst:
            // throw new HttpException('Setup konnte nicht aktiviert werden', HttpStatus.BAD_GATEWAY);
          }
        }

    } catch (err) {
      console.error('Error while creating Discord category:', err);
      throw new HttpException(
        'Bot konnte die Discord-Kategorie nicht anlegen.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return newCat;
  }

  // -------------------------------------
  // 3) UPDATE
  // -------------------------------------
  async updateCategory(
    catId: string,
    data: Partial<{
      name: string;
      categoryType: string;
      isVisible: boolean;
      allowedRoles: string[];
      trackingActive: boolean;
      sendSetup: boolean;
    }>,
  ) {

        // (A) "alte" Daten laden
        const oldCat = await this.prisma.category.findUnique({
          where: { id: catId },
        });
        if (!oldCat) {
          throw new HttpException('Category not found (oldCat)', HttpStatus.NOT_FOUND);
        }
    
        const wasSetup = oldCat.sendSetup === true;


    // (A) DB => update
    const updated = await this.prisma.category.update({
      where: { id: catId },
      data,
    });
    

    const isNowSetup = updated.sendSetup === true;


    // (B) Falls Name geändert => rename in Discord
    if (data.name) {
      try {
        if (!updated.discordCategoryId) {
          console.warn(
            `updateCategory: Category ${catId} hat keine discordCategoryId => Überspringe rename.`,
          );
        } else {
          const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
          await axios.patch(`${botUrl}/discord/categories`, {
            id: updated.discordCategoryId,
            newName: data.name,
            isVisible: data.isVisible,
            allowedRoles: data.allowedRoles,
          });
        }
      } catch (err) {
        console.error('Error while updating Discord category:', err);
        throw new HttpException(
          'Bot konnte die Discord-Kategorie nicht umbenennen.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
        
    // -------------------------------------------
    // 2) Logik: Umschalten Setup => Zonen-VoiceChannel
    // -------------------------------------------
    
    // A) false => true
    if (!wasSetup && isNowSetup) {
    //   1) Zone-VC löschen (nur in Discord!), DB => discordChannelId=null
    await this.removeZoneVoiceChannelsWithoutSettingDeleted(catId);
    //   2) Setup-Kanäle anlegen
    try {
       const apiUrl = process.env.API_URL || 'http://localhost:3004';
        await axios.post(`${apiUrl}/setup/activate`, { categoryId: catId });
      } catch (err) {
        console.error('Error calling /setup/activate:', err);
          }
        }
    
        // B) true => false
        if (wasSetup && !isNowSetup) {
          //   1) Setup-Kanäle entfernen
          await this.setupService.deactivateSetup(catId);
          //   2) Zonen-VoiceChannel wiederherstellen
          await this.restoreZoneVoiceChannels(catId);
         }
    return updated;
  }


    /**
   * Löscht alle VoiceChannels der Zonen in Discord (aber setzt NICHT deletedInDiscord=true).
   * In der DB wird lediglich `discordChannelId=null` gesetzt.
   */
  private async removeZoneVoiceChannelsWithoutSettingDeleted(categoryId: string) {
    // Alle Zonen + deren voiceChannels
    const zones = await this.prisma.zone.findMany({
      where: { categoryId },
      include: { voiceChannels: true },
    });
    const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';

    for (const z of zones) {
      for (const vc of z.voiceChannels) {
        if (!vc.discordChannelId) continue; // schon null => skip
        // A) Discord löschen
        try {
          await axios.delete(`${botUrl}/discord/voice-channels/${vc.discordChannelId}`);
        } catch (err) {
          console.warn('Fehler beim Remove VC (Setup-Switch):', err);
        }
        // B) DB => discordChannelId=null
        await this.prisma.voiceChannel.update({
          where: { id: vc.id },
          data: { discordChannelId: null },
        });
      }
    }
  }

  /**
   * Re-erstellt VoiceChannels für alle Zonen, deren channels `discordChannelId=null` & `deletedInDiscord=false`.
   */
  private async restoreZoneVoiceChannels(categoryId: string) {
    const zones = await this.prisma.zone.findMany({
      where: { categoryId },
      include: { voiceChannels: true },
    });
    for (const z of zones) {
      for (const vc of z.voiceChannels) {
        if (!vc.discordChannelId && !vc.deletedInDiscord) {
          await this.recreateOneVoiceChannel(vc);
        }
      }
    }
  }

  /** Legt EINEN VoiceChannel neu in Discord an + speichert ID in DB */
  private async recreateOneVoiceChannel(vc: { id: string, zoneId: string|null }) {
    if (!vc.zoneId) return;
    const zone = await this.prisma.zone.findUnique({
      where: { id: vc.zoneId }, 
      include: { category: true },
    });
    if (!zone?.category?.discordCategoryId) return;
    // -> create in Discord
    const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
    try {
      const resp = await axios.post(`${botUrl}/discord/voice-channels`, {
        channelName: zone.zoneName,
        categoryId: zone.category.discordCategoryId,
      });
      const newId = resp.data.discordChannelId;
      if (newId) {
        await this.prisma.voiceChannel.update({
          where: { id: vc.id },
          data: { discordChannelId: newId },
        });
      }
    } catch (err) {
      console.warn('Fehler bei recreateOneVoiceChannel:', err);
    }
  }
  // -------------------------------------
  // 4) DELETE
  // -------------------------------------
  async deleteCategory(catId: string) {
    // (A) DB => Eintrag holen
    const cat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // (A2) Setup-Kanäle entfernen, falls Setup aktiv war
    // => Aufruf: this.setupService.deactivateSetup(catId)
    await this.setupService.deactivateSetup(catId);

    // (B) Prüfen, ob noch Zonen existieren
    const zoneCount = await this.prisma.zone.count({
      where: { categoryId: catId },
    });
    if (zoneCount > 0) {
      throw new HttpException(
        'Kategorie kann nicht gelöscht werden, solange noch Zonen damit verknüpft sind!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // (A) Setup-Kanäle entfernen, falls vorhanden
    // => Falls "sendSetup" aktiv war, existieren SetupChannels 
    await this.setupService.deactivateSetup(catId);


    // (C) Bot => DELETE /discord/categories/:discordCategoryId
    if (cat.discordCategoryId) {
      try {
        const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
        await axios.delete(`${botUrl}/discord/categories/${cat.discordCategoryId}`);
      } catch (err) {
        console.error('Error while deleting Discord category:', err);
        throw new HttpException(
          'Bot konnte Discord-Kategorie nicht löschen.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    } else {
      console.warn(
        `deleteCategory: Category ${catId} hat KEINE discordCategoryId => kein Discord-Delete`,
      );
    }

     // (D) Soft Delete => Set "deletedInDiscord = true"
     // So bleibt der Eintrag in der DB erhalten.
     return this.prisma.category.update({
       where: { id: catId },
       data: { deletedInDiscord: true },
     });
  }

  // -------------------------------------
  // 5) MARK AS DELETED (Bot hat Category gelöscht)
  // -------------------------------------
  async markAsDeletedInDiscord(discordCategoryId: string) {
    console.log('markAsDeletedInDiscord => discordCategoryId=', discordCategoryId);

    // (A) Datensatz finden
    const cat = await this.prisma.category.findFirst({
      where: { discordCategoryId },
    });
    console.log('Gefundene Category:', cat);

    if (!cat) {
      throw new Error(`Category not found for channelId=${discordCategoryId}`);
    }

    // (B) DB => "deletedInDiscord = true"
    try {
      const updated = await this.prisma.category.update({
        where: { id: cat.id },
        data: { deletedInDiscord: true },
      });
      console.log('Update done =>', updated);
      return updated;
    } catch (err) {
      console.error('Prisma Update Fehler =>', err);
      throw err;
    }
  }

  // -------------------------------------
  // 6) RESTORE (NEU)
  // -------------------------------------
  async restoreCategoryInDiscord(catId: string) {
    // (A) DB => load
    const cat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // (B) Prüfen => deletedInDiscord?
    if (!cat.deletedInDiscord) {
      throw new HttpException(
        'Kategorie ist gar nicht als gelöscht markiert.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // (C) Bot => neu anlegen
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const response = await axios.post(`${botUrl}/discord/categories`, {
        name: cat.name,
      });
      const { discordChannelId } = response.data;
      if (!discordChannelId) {
        throw new Error('No channelId returned from Bot');
      }

      // (D) DB => update
      const updated = await this.prisma.category.update({
        where: { id: cat.id },
        data: {
          discordCategoryId: discordChannelId,
          deletedInDiscord: false,
        },
      });
       
       // (E) VOICE CHANNELS => Re-parent noch existierende VoiceChannels
       try {
         // 1) Alle Zonen dieser Kategorie
         const zones = await this.prisma.zone.findMany({
           where: { categoryId: cat.id },
         });
       
         for (const z of zones) {
           // 2) VoiceChannels laden, die nicht deletedInDiscord sind
           //    und eine discordChannelId haben
           const voiceChannels = await this.prisma.voiceChannel.findMany({
             where: {
               zoneId: z.id,
               deletedInDiscord: false,
               discordChannelId: { not: null },
             },
           });
       
           for (const vc of voiceChannels) {
             // 3) Bot => PATCH /discord/voice-channels/:discordChannelId => newCategoryId
             await axios.patch(`${botUrl}/discord/voice-channels/${vc.discordChannelId}`, {
               newCategoryId: discordChannelId, // Das neue Category-Id aus (C)
             });
           }
         }
       } catch (err) {
         console.warn(
           "restoreCategoryInDiscord -> Fehler beim Re-Parenting existierender VoiceChannels:",
           err,
         );
         // Kein Throw => Wir brechen das Restore nicht ab,
         //   nur weil das Re-Parenting ggf. fehlschlägt.
       }
      return updated;
    } catch (err) {
      console.error('restoreCategoryInDiscord -> Bot error:', err);
      throw new HttpException(
        'Bot konnte die Discord-Kategorie nicht neu anlegen.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }






    
      // -------------------------------------
      // 7) HARD-DELETE (Neu): DB-Datensatz wirklich entfernen
      // -------------------------------------
      async deleteCategoryHard(catId: string) {
        // 1) prüfen: Hat diese Category noch Zonen? => selbes check wie oben
        const zoneCount = await this.prisma.zone.count({
          where: { categoryId: catId },
        });
        if (zoneCount > 0) {
          throw new HttpException(
            'Kategorie kann nicht gelöscht werden, solange noch Zonen damit verknüpft sind!',
            HttpStatus.BAD_REQUEST,
          );
        }

        await this.setupService.deactivateSetup(catId);
    
        // 2) Falls in Discord noch existiert => Discord-Kanal löschen
        //    (frei nach Gusto: kann man auch weglassen oder drinlassen.)
        const cat = await this.prisma.category.findUnique({
          where: { id: catId },
        });
        if (cat?.discordCategoryId) {
          const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
          try {
            await axios.delete(`${botUrl}/discord/categories/${cat.discordCategoryId}`);
          } catch (err) {
            console.error('Error while deleting Discord category [HARD-DELETE]:', err);
          }
        }
    
        // 3) DB => wirklich löschen
        return this.prisma.category.delete({
          where: { id: catId },
        });
  }
}
