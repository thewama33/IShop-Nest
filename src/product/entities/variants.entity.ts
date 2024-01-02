import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'variant' })
export class VariantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  color: string;
  @Column({ nullable: true })
  size: number;
  @Column({ nullable: true })
  material: string;
  @Column({ nullable: true })
  image: string;

  @OneToOne(() => ProductEntity, (product) => product.variants)
  @JoinColumn()
  product: ProductEntity;
}
