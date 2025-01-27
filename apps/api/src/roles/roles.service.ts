// Pfad: apps/api/src/roles/roles.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RolesService {
  /**
   * Fragt beim Bot an => GET /discord/roles
   * Gibt { roles: [ ... ]} zurück
   */
  async getAllRoles() {
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const resp = await axios.get(`${botUrl}/discord/roles`);
      // resp.data z. B. { roles: [...] }

      return resp.data;
      // => du könntest "return resp.data.roles" machen,
      //    falls du nur das roles-Array weitergeben willst
    } catch (err) {
      throw new HttpException('Bot not reachable', HttpStatus.BAD_GATEWAY);
    }
  }
}
