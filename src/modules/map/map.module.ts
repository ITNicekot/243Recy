// src/modules/map/map.module.ts
import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MapController],
  providers: [PrismaService],
})
export class MapModule {}