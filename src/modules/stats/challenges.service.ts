import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

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
    const existing = await this.prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: { userId, challengeId },
      },
    });
    if (existing) throw new Error('Déjà inscrit');
    return this.prisma.userChallenge.create({
      data: {
        userId,
        challengeId,
        progress: 0,
        completed: false,
      },
    });
  }

  // Mettre à jour la progression (appelé quand une alerte est validée)
  async updateProgress(userId: string, increment: number = 1) {
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
        // Attribuer des points ou badges
        await this.awardChallengeReward(userId, uc.challenge);
      }
    }
  }

  private async awardChallengeReward(userId: string, challenge: any) {
    // Ajouter des points à l'utilisateur ? On peut avoir un champ points dans User
    // Ou créer une transaction
    // Pour simplifier, on crée une transaction de type "gain"
    await this.prisma.transaction.create({
      data: {
        userId,
        amount: challenge.rewardPoints,
        type: 'gain',
      },
    });
  }
}