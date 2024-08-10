import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserDataMiddleware } from './users.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { CreateBudgetService } from './create.service';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, CreateBudgetService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes('user');
  }
}
