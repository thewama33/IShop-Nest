import { UserEntity } from 'src/users/entity/users.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

@Entity({ name: 'cart' })
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn()
  user: UserEntity;

 // @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
 // items: CartItemEntity[];
}
