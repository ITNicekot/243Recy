import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsGateway } from './alerts.gateway';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';
import { ChallengesService } from '../challenges/challenges.service';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, PrismaService, AlertsGateway, TransactionsService, ChallengesService],
  exports: [AlertsGateway], // ← Ajout important
})
export class AlertsModule {}