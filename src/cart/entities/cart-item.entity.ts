import { AbstractEntity } from 'src/utils/entity.abstraction';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Entity({ name: 'cartitem' })
export class CartItemEntity extends AbstractEntity<CartItemEntity> {
  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cartId' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: ProductEntity;
}
