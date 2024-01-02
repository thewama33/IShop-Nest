// src/entities/cart-item.entity.ts

import { ProductEntity } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity({ name: 'cartitem' })
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  totalPrice: number;

  //@ManyToOne(() => CartEntity, (cart) => cart.items)
  @Column()
  cartId: number;

  // @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  @Column()
  productId: number;
}
