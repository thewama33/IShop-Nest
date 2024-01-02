import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { ProfileEntity } from './entity/profile.entity';
import { UserEntity } from './entity/users.entity';
import { JwtStrategy } from './jwtStrategy.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserValidateMiddlewareMiddleware } from 'src/middlewares/user-validate.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtStrategy],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserValidateMiddlewareMiddleware)
      .forRoutes(
        { path: 'api/users/delete', method: RequestMethod.DELETE },
        { path: 'api/users/single', method: RequestMethod.GET },
        { path: 'api/users/profile', method: RequestMethod.POST },
        { path: 'api/users/profile', method: RequestMethod.PATCH },
      );
  }
}
