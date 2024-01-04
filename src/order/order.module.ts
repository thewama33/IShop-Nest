import { Global, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CartEntity]),
    CartModule,
    UsersModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
