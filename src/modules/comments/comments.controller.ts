import { Controller, Post, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  addComment(@Body() body: { alertId: string; content: string }, @Req() req) {
    return this.commentsService.addComment(req.user.uid, body.alertId, body.content);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  removeComment(@Param('id') id: string, @Req() req) {
    return this.commentsService.removeComment(req.user.uid, id);
  }

  @Get('alert/:alertId')
  getCommentsByAlert(@Param('alertId') alertId: string) {
    return this.commentsService.getCommentsByAlert(alertId);
  }
}