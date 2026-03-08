// src/modules/challenges/challenges.controller.ts
import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('active')
  async getActiveChallenges() {
    return this.challengesService.getActiveChallenges();
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMyChallenges(@Req() req) {
    return this.challengesService.getUserChallenges(req.user.uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post(':id/join')
  async joinChallenge(@Param('id') id: string, @Req() req) {
    return this.challengesService.joinChallenge(req.user.uid, id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('badges')
  async getMyBadges(@Req() req) {
    return this.challengesService.getUserBadges(req.user.uid);
  }
}