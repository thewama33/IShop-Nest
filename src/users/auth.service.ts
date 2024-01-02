import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfileEntity } from './entity/profile.entity';
import { UpdateUserProfile } from './dto/update-user-profile.dto';

config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,

    private readonly entityManager: EntityManager,
    private readonly jwtService: JwtService,
  ) {}
  async login(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOneBy({ email: createUserDto.email });

    console.log(user);

    if (!user) throw new NotAcceptableException('Invalid email or password');

    const isValidPassword = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!isValidPassword)
      throw new NotAcceptableException('Invalid email or password');

    const token = this.jwtService.sign({ user });

    if (createUserDto.fcmToken)
      await this.userModel.update(user.id, {
        fcmToken: createUserDto.fcmToken,
      });

    console.log('User After fcm token ', user);

    return {
      code: HttpStatus.OK,
      message: 'User logged in successfully',
      token: token,
    };
  }
  async register(createUserDto: CreateUserDto) {
    console.log(...[createUserDto]);

    const isUserExists = await this.userModel.findOneBy({
      email: createUserDto.email,
    });

    if (isUserExists)
      throw new NotAcceptableException('User email is already exist');

    const user = this.userModel.create(createUserDto);

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(user);
    });

    return {
      code: HttpStatus.OK,
      message: 'User Created Successfully',
    };
  }
}
