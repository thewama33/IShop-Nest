import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'profile' })
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  age: number;
  @Column()
  phoneNumber: string;
  @Column()
  address: string;
  @Column()
  city: string;
  @Column()
  country: string;

  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' }) // specify inverse side as a second parameter
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
