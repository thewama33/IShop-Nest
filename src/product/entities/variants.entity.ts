import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
