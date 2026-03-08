// src/modules/challenges/challenges.module.ts
import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService, PrismaService, TransactionsService],
})
export class ChallengesModule {}