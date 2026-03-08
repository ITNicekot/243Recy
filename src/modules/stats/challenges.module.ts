import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService, PrismaService],
})
export class ChallengesModule {}