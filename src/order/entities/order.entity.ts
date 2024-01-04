import { UserEntity } from 'src/users/entity/users.entity';
import { AbstractEntity } from 'src/utils/entity.abstraction';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity extends AbstractEntity<OrderEntity> {
  // @ManyToOne(() => ProductEntity, { eager: true }) // Assuming each order is associated with a single product for simplicity
  // @JoinColumn({ name: 'productId' })
  // product: ProductEntity;

  // @ManyToOne(() => UserEntity, (user) => user.orders)
  // @JoinColumn({ name: 'userId' })
  // user: UserEntity;

  // @OneToMany(() => OrderItemEntity, (orderitem) => orderitem.order, {
  //   cascade: true,
  // })
  // orderItems: OrderItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItemEntity[];

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
