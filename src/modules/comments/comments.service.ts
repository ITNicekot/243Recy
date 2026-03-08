import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertsGateway } from '../alerts/alerts.gateway';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private alertsGateway: AlertsGateway,
  ) {}

  async addComment(userId: string, alertId: string, content: string) {
    const alert = await this.prisma.alert.findUnique({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Alerte non trouvée');

    const comment = await this.prisma.comment.create({
      data: { userId, alertId, content },
      include: { user: { select: { phone: true } } },
    });
    this.alertsGateway.emitNewComment(comment);
    return comment;
  }

  async removeComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, userId },
    });
    if (!comment) throw new NotFoundException('Commentaire non trouvé');
    return this.prisma.comment.delete({ where: { id: commentId } });
  }

  async getCommentsByAlert(alertId: string) {
    return this.prisma.comment.findMany({
      where: { alertId },
      include: { user: { select: { phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}