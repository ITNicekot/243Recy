// src/modules/challenges/challenges.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class ChallengesService {
  constructor(
    private prisma: PrismaService,
    private transactionsService: TransactionsService,
  ) {}

  async getActiveChallenges() {
    const now = new Date();
    return this.prisma.challenge.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
  }

  async getUserChallenges(userId: string) {
    return this.prisma.userChallenge.findMany({
      where: { userId },
      include: { challenge: true },
    });
  }

  async joinChallenge(userId: string, challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) {
      throw new NotFoundException('Défi non trouvé');
    }

    try {
      return await this.prisma.userChallenge.create({
        data: {
          userId,
          challengeId,
          progress: 0,
          completed: false,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Vous êtes déjà inscrit à ce défi');
      }
      throw error;
    }
  }

  async updateProgress(userId: string, increment: number = 1) {
    // Récupérer les défis en cours de l'utilisateur
    const userChallenges = await this.prisma.userChallenge.findMany({
      where: {
        userId,
        completed: false,
        challenge: {
          endDate: { gte: new Date() },
        },
      },
      include: { challenge: true },
    });

    for (const uc of userChallenges) {
      const newProgress = uc.progress + increment;
      const completed = newProgress >= uc.challenge.goal;

      await this.prisma.userChallenge.update({
        where: { id: uc.id },
        data: {
          progress: newProgress,
          completed,
          completedAt: completed ? new Date() : null,
        },
      });

      if (completed) {
        // Attribuer les points de récompense
        await this.transactionsService.createTransaction(
          userId,
          uc.challenge.rewardPoints,
          'gain',
        );
        // Optionnel : attribuer un badge ici
      }
    }
  }

  // Pour les badges, on pourrait avoir un service séparé, mais on le fait ici
  async awardBadge(userId: string, badgeName: string) {
    const badge = await this.prisma.badge.findUnique({
      where: { name: badgeName },
    });
    if (!badge) {
      throw new NotFoundException('Badge non trouvé');
    }

    // Vérifier si l'utilisateur a déjà ce badge
    const existing = await this.prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });
    if (existing) {
      return existing; // déjà obtenu
    }

    return this.prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });
  }

  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });
  }
}