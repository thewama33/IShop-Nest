import { CartItemEntity } from 'src/cart/entities/cart-item.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VariantEntity } from './variants.entity';

@Entity({ name: 'product' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @OneToOne(() => VariantEntity, { cascade: true })
  variants: VariantEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.product)
  @JoinColumn()
  category: CategoryEntity[];

  //@OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  //cartItems: CartItemEntity[];

  @CreateDateColumn()
  createdAt: String;

  @UpdateDateColumn()
  updtedAt: String;
}
