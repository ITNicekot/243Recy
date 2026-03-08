import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertsGateway } from '../alerts/alerts.gateway';

@Injectable()
export class LikesService {
  constructor(
    private prisma: PrismaService,
    private alertsGateway: AlertsGateway,
  ) {}

  async addLike(userId: string, alertId: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Alerte non trouvée');

    try {
      const like = await this.prisma.like.create({
        data: { userId, alertId },
        include: { user: { select: { phone: true } } },
      });
      this.alertsGateway.emitNewLike(like);
      return like;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Vous avez déjà liké cette alerte');
      }
      throw error;
    }
  }

  async removeLike(userId: string, likeId: string) {
    const like = await this.prisma.like.findFirst({
      where: { id: likeId, userId },
    });
    if (!like) throw new NotFoundException('Like non trouvé');
    return this.prisma.like.delete({ where: { id: likeId } });
  }

  async getLikesByAlert(alertId: string) {
    return this.prisma.like.findMany({
      where: { alertId },
      include: { user: { select: { phone: true } } },
    });
  }
}