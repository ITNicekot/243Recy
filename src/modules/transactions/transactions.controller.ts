import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getMyTransactions(@Req() req) {
    return this.transactionsService.getUserTransactions(req.user.uid);
  }
}