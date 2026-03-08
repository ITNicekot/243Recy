import { Module } from '@nestjs/common';
import { AlertsModule } from './modules/alerts/alerts.module';
import { UploadModule } from './modules/upload/upload.module';
import { AuthModule } from './modules/auth/auth.module';
import { LikesModule } from './modules/likes/likes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { MapModule } from './modules/map/map.module';
import { StatsModule } from './modules/stats/stats.module';
import { UsersModule } from './modules/users/users.module'; // ← Ajout

@Module({
  imports: [
    AlertsModule,
    UploadModule,
    AuthModule,
    LikesModule,
    CommentsModule,
    TransactionsModule,
    ChallengesModule,
    MapModule,
    StatsModule,
    UsersModule,
  ],
})
export class AppModule {}