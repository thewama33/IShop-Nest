import {
  Module
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AuthGuard } from 'src/guards/authentication.guard';
import { AuthService } from './auth.service';
import { ProfileEntity } from './entity/profile.entity';
import { UserEntity } from './entity/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

config();
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5d' },
    }),
  ],
  exports: [UsersService, AuthService],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService,
    AuthService,
  ],
})
export class UsersModule {}
