import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserDataMiddleware } from './users.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { CreateBudgetService } from './create.service';
import { UpdateBudgetService } from './update.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    FirebaseModule,
    forwardRef(() => AuthModule), // Use forwardRef here
    JwtModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, CreateBudgetService, UpdateBudgetService],
  exports: [UsersService, CreateBudgetService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes('user');
  }
}
