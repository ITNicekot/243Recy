import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [AlertsModule], // ← Ajout
  controllers: [LikesController],
  providers: [LikesService, PrismaService],
})
export class LikesModule {}