import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/users/entity/users.entity';
import { AbstractEntity } from 'src/utils/entity.abstraction';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class OrderEntity extends AbstractEntity<OrderEntity> {
  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ type: 'text', nullable: true })
  paymentMethod: string;

  @ManyToOne(() => ProductEntity, { eager: true }) // Assuming each order is associated with a single product for simplicity
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
