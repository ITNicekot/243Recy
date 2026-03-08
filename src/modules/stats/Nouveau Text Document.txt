import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get('active')
  async getActive() {
    return this.challengesService.getActiveChallenges();
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMyChallenges(@Req() req) {
    return this.challengesService.getUserChallenges(req.user.uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post(':id/join')
  async join(@Param('id') id: string, @Req() req) {
    return this.challengesService.joinChallenge(req.user.uid, id);
  }
}