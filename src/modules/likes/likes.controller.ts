import { Controller, Post, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  addLike(@Body('alertId') alertId: string, @Req() req) {
    return this.likesService.addLike(req.user.uid, alertId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  removeLike(@Param('id') id: string, @Req() req) {
    return this.likesService.removeLike(req.user.uid, id);
  }

  @Get('alert/:alertId')
  getLikesByAlert(@Param('alertId') alertId: string) {
    return this.likesService.getLikesByAlert(alertId);
  }
}