import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from 'src/utils/entity.abstraction';
import { UserEntity } from 'src/users/entity/users.entity';
import { CartItemEntity } from './cart-item.entity';

@Entity({ name: 'cart' })
export class CartEntity extends AbstractEntity<CartEntity> {
  @Column({ type: 'bool', default: false })
  isCompleted: boolean;
  @ManyToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cartitem) => cartitem.cart, {
    cascade: true,
  })
  cartItems: CartItemEntity[];
}
