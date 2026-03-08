import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { StatsService } from './stats.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMyStats(@Req() req) {
    return this.statsService.getUserStats(req.user.uid);
  }

  @Get('global')
  async getGlobalStats() {
    return this.statsService.getGlobalStats();
  }
}