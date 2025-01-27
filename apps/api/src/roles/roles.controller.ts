// Pfad: apps/api/src/roles/roles.controller.ts

import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getAllRoles() {
    // Ruft Service => der ruft Bot => Daten => Return
    // => Endpoint: GET /roles
    return this.rolesService.getAllRoles();
  }
}
