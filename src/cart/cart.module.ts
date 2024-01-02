import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { UsersModule } from 'src/users/users.module';
import { CartItemEntity } from './entities/cart-item.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity, ProductEntity]),
    UsersModule,
  ],
  exports: [CartService],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
