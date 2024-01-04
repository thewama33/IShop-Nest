import { ProductEntity } from 'src/product/entities/product.entity';
import { AbstractEntity } from 'src/utils/entity.abstraction';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'orderItem' })
export class OrderItemEntity extends AbstractEntity<OrderItemEntity> {
  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  @JoinColumn()
  product: ProductEntity;

  @Column({ default: 0, nullable: true })
  quantity: number;

  @Column({ nullable: true, default: 0 })
  price: number;

  @Column({ nullable: true, default: 0 })
  total: number;
}
