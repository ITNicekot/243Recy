// src/modules/map/map.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('map')
export class MapController {
  constructor(private prisma: PrismaService) {}

  @Get('alerts')
  async getAlertsForMap(
    @Query('swLat') swLat?: number,
    @Query('swLng') swLng?: number,
    @Query('neLat') neLat?: number,
    @Query('neLng') neLng?: number,
  ) {
    const where: any = {};
    if (swLat && neLat && swLng && neLng) {
      where.latitude = { gte: swLat, lte: neLat };
      where.longitude = { gte: swLng, lte: neLng };
    }
    const alerts = await this.prisma.alert.findMany({
      where,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        status: true,
        mediaUrl: true,
        createdAt: true,
        isAquatic: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return alerts;
  }
}