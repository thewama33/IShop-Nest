import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import 'reflect-metadata';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { TermsModule } from './terms/terms.module';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';

config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5h' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '111111',
      database: 'ishop',
      entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
      logger: 'advanced-console',
      relationLoadStrategy: 'join',
      migrations: ['migrations/*'],
      autoLoadEntities: true,
      synchronize: true,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    UsersModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    TermsModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
