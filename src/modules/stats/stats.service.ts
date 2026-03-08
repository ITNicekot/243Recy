import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getUserStats(userId: string) {
    const alerts = await this.prisma.alert.findMany({
      where: { userId },
    });
    const validated = alerts.filter(a => a.status === 'validated').length;
    const pending = alerts.filter(a => a.status === 'pending').length;
    const aquatic = alerts.filter(a => a.isAquatic).length;
    const totalPoints = validated * 10; // 10 points par alerte validée

    return {
      totalAlerts: alerts.length,
      validated,
      pending,
      aquatic,
      totalPoints,
      // Estimation CO₂ : par exemple 1kg de déchet évité = 2kg CO₂ (à ajuster)
      co2Saved: validated * 2, // valeur fictive
    };
  }

  async getGlobalStats() {
    const totalAlerts = await this.prisma.alert.count();
    const validated = await this.prisma.alert.count({ where: { status: 'validated' } });
    const users = await this.prisma.user.count();
    const aquatic = await this.prisma.alert.count({ where: { isAquatic: true } });

    return {
      totalAlerts,
      validated,
      users,
      aquatic,
    };
  }
}