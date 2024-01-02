import * as bcrypt from 'bcrypt';
import { CartEntity } from 'src/cart/entities/cart.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

enum Role {
  USER,
  ADMIN,
}

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn()
  createdAt: String;

  @UpdateDateColumn()
  updtedAt: String;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;

  @OneToOne(() => CartEntity, (cart) => cart.user)
  cart: CartEntity;

  // @OneToOne((type) => OrderEntity, (order) => order.id)
  // @JoinColumn()
  // order: OrderEntity;

  @BeforeInsert()
  encryptPassword() {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(this.password, saltRounds);

    this.password = hashedPassword;
  }
}
