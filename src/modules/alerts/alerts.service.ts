import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertsGateway } from './alerts.gateway';
import { CreateAlertDto } from './dto/create-alert.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { ChallengesService } from '../challenges/challenges.service';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private alertsGateway: AlertsGateway,
    private transactionsService: TransactionsService,
    private challengesService: ChallengesService,
  ) {}

  private async ensureUserExists(userId: string, phone?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      // Créer l'utilisateur avec l'ID Firebase et le téléphone
      await this.prisma.user.create({
        data: {
          id: userId,
          phone: phone || 'unknown', // On utilisera le téléphone réel si fourni
        },
      });
    }
  }

  async create(userId: string, dto: CreateAlertDto, isAquatic?: boolean, waterType?: string, phone?: string) {
    await this.ensureUserExists(userId, phone);
    const alert = await this.prisma.alert.create({
      data: {
        userId,
        mediaUrl: dto.mediaUrl,
        latitude: dto.latitude,
        longitude: dto.longitude,
        status: 'pending',
        isAquatic: isAquatic || false,
        waterType: waterType,
      },
      include: { user: { select: { phone: true } } },
    });
    this.alertsGateway.emitNewAlert(alert);
    return alert;
  }

  async findAll() {
    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { phone: true } } },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { phone: true } } },
    });
  }

  async validateAlert(alertId: string) {
    const updatedAlert = await this.prisma.alert.update({
      where: { id: alertId },
      data: { status: 'validated' },
      include: { user: true },
    });
    // Créer une transaction de gain (10 points)
    await this.transactionsService.createTransaction(updatedAlert.userId, 10, 'gain');
    // Mettre à jour la progression des défis
    await this.challengesService.updateProgress(updatedAlert.userId, 1);
    this.alertsGateway.emitAlertUpdated(updatedAlert);
    return updatedAlert;
  }
}