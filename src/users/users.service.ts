import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserEntity } from './entity/users.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInfoDTO } from './dto/create-user-profile.dto';
import { ProfileEntity } from './entity/profile.entity';
import { UpdateUserProfile } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileModel: Repository<ProfileEntity>,
  ) {}

  async createUserProfile(createUserProfileDto: CreateUserInfoDTO, request) {
    try {
      const userData = await this.userModel.findOne({
        where: { id: request.id },
        select: { password: false, role: false },
      });

      const savedProfile = await this.profileModel.save(createUserProfileDto);

      userData.profile = savedProfile;

      await this.userModel.save(userData);

      return {
        code: HttpStatus.OK,
        message: 'User Registered Successfully',
        data: savedProfile,
      };
    } catch (error) {
      throw new BadRequestException('Something Went Wrong ' + error);
    }
  }

  async findAll() {
    const users = await this.userModel.find({
      relations: ['profile'],
      select: { password: false, role: false },
    });

    return {
      code: HttpStatus.OK,
      message: 'Results Fetched Successfully',
      data: users,
    };
  }

  //Getting user id form the Token
  //

  async findOne(request) {
    const user = await this.userModel.findOne({
      select: { password: false, role: false },
      where: { id: request.id },
      relations: ['profile'],
    });

    if (!user) throw new NotFoundException('User Not Found');

    return {
      code: HttpStatus.OK,
      message: 'Results Fetched Successfully',
      data: user,
    };
  }

  async updateUserProfile(updateUserProfileDto: UpdateUserProfile, request) {
    // Find the user's profile with the specified userId
    const profile = await this.profileModel.findOne({
      where: {
        user: { id: request.id },
      },
    });

    if (!profile) {
      // Handle the case when the profile does not exist
      return {
        code: HttpStatus.NOT_FOUND,
        message: 'Profile not found',
      };
    }

    // Update the profile properties using the updateUserProfileDto
    Object.assign(profile, updateUserProfileDto);

    // Save the updated profile
    const savedProfile = await this.profileModel.save(profile);

    return {
      code: HttpStatus.OK,
      message: 'Profile updated successfully',
      data: savedProfile,
    };
  }

  async remove(request) {
    console.log('User ID :', request.id);

    // First Get the Model with all its relations
    // Delete the Model

    const user = await this.userModel.findOne({
      where: { id: request.id },
      relations: { profile: true },
    });

    if (user) {
      await this.userModel.remove(user);
    }
    return {
      code: HttpStatus.OK,
      message: 'User removed successfully',
    };
  }
}
