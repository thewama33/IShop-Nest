import * as bcrypt from 'bcrypt';
import {
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
import { CartEntity } from 'src/cart/entities/cart.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { Role } from 'src/constants/enums';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updtedAt: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { eager: true })
  profile: ProfileEntity;

  @OneToMany(() => CartEntity, (cart) => cart.user, {
    cascade: true,
  })
  cart: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.id)
  orders: OrderEntity;

  @BeforeInsert()
  encryptPassword() {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(this.password, saltRounds);

    this.password = hashedPassword;
  }
}
