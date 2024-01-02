import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VariantEntity } from './variants.entity';
import { CartItemEntity } from 'src/cart/entities/cart-item.entity';
import { TagsEntity } from './tags.entity';

@Entity({ name: 'product' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    nullable: true,
    default: 0,
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'int', default: 0, nullable: true })
  stock: number;

  @OneToOne(() => VariantEntity, (variant) => variant.product, {
    cascade: true,
  })
  variants: VariantEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.product, {
    cascade: true,
  })
  category: CategoryEntity[];

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product, {
    cascade: true,
  })
  cartItems: CartItemEntity[];

  @ManyToMany(() => TagsEntity, (tag) => tag.products)
  @JoinTable({
    name: 'product_tag',
    joinColumns: [{ name: 'productId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'tagId', referencedColumnName: 'id' }],
  })
  tags: TagsEntity[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updtedAt: string;
}
