import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/users.entity';
import { JwtService } from '@nestjs/jwt';

config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.userModel.findOneBy({ email: email });

    console.log(user);

    if (!user) throw new NotAcceptableException('Invalid email or password');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      throw new NotAcceptableException('Invalid email or password');

    const token = this.jwtService.sign({user});

    console.log(user);

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

    this.userModel.save(user);

    return {
      code: HttpStatus.OK,
      message: 'User Created Successfully',
      data: createUserDto,
    };
  }
}
