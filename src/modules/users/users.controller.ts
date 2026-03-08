import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Patch('me/avatar')
  async updateAvatar(@Req() req, @Body('avatarUrl') avatarUrl: string) {
    return this.usersService.updateAvatar(req.user.uid, avatarUrl);
  }
}