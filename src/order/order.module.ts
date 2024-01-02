import { Global, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, CartEntity]),
    CartModule,
    UsersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
