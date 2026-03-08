import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [AlertsModule], // ← Ajout
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
})
export class CommentsModule {}