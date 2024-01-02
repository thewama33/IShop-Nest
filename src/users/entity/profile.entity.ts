import {
  BaseEntity,
  Column,
  Entity,
  Exclusion,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'profile' })
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  age: number;
  @Column({ nullable: true })
  phoneNumber: string;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  country: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' }) // specify inverse side as a second parameter
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
