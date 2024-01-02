import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserInfoDTO } from './dto/create-user-profile.dto';
import { UpdateUserProfile } from './dto/update-user-profile.dto';
import { ProfileEntity } from './entity/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileModel: Repository<ProfileEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async createUserProfile(
    createUserProfileDto: CreateUserInfoDTO,
    currentUser,
  ) {
    const userId = currentUser.id;
    try {
      const userData = await this.userModel.findOneBy({
        id: userId,
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
    const users = await this.entityManager
      .createQueryBuilder(UserEntity, 'users')
      .innerJoinAndSelect('users.profile', 'profile')
      .select([
        'users.id AS id',
        'users.email AS email',
        'users.role AS role',
        'profile.firstName AS firstName',
        'profile.lastName AS lastName',
        'profile.age AS age',
        'profile.phoneNumber AS phoneNumber',
        'profile.address AS address',
        'profile.city AS city',
        'profile.country AS country',
      ])
      .getRawMany();

    return {
      code: HttpStatus.OK,
      message: 'Results Fetched Successfully',
      data: users,
    };
  }

  async findOne(currentUser) {
    const user = await this.entityManager
      .createQueryBuilder(UserEntity, 'users')
      .leftJoinAndSelect('users.profile', 'profile')
      .where('users.id = :id', { id: currentUser.id })
      .select([
        'users.id As id',
        'users.email As email',
        'profile.firstName AS firstName',
        'profile.lastName AS lastName',
        'profile.age AS age',
        'profile.phoneNumber AS phoneNumber',
        'profile.address AS address',
        'profile.city AS city',
        'profile.country AS country',
        'users.role as role',
      ])
      .getRawOne();

    return {
      code: HttpStatus.OK,
      message: 'Results Fetched Successfully',
      data: user,
    };
  }

  async updateUserProfile(
    updateUserProfileDto: UpdateUserProfile,
    currentUser,
  ) {
    // const profileRepo = await this.userModel
    //   .createQueryBuilder()
    //   .update(ProfileEntity)
    //   .set({ ...updateUserProfileDto })
    //   .where('userId = :id  ', { id: 5 })
    //   .execute();

    // Find the user's profile with the specified userId
    // const profile = await this.profileModel.findOne({
    //   where: {
    //     user: { id: request.id },
    //   },
    // });

    // if (!profile) {
    //   // Handle the case when the profile does not exist
    //   return {
    //     code: HttpStatus.NOT_FOUND,
    //     message: 'Profile not found',
    //   };
    // }

    // // Update the profile properties using the updateUserProfileDto
    // Object.assign(profile, updateUserProfileDto);

    // // Save the updated profile
    // await this.profileModel.save(profile);

    const profile = await this.entityManager
      .createQueryBuilder(ProfileEntity, 'profile')
      .update(ProfileEntity)
      .set(updateUserProfileDto)
      .where('userId = :id', { id: currentUser.id })
      .execute();

    return {
      code: HttpStatus.OK,
      message: 'Profile updated successfully',
    };
  }

  async remove(currentUser) {
    try {
      console.log('User ID :', currentUser);

      const userId = currentUser.id;

      // First Get the Model with all its relations
      // Delete the Model

      const user = await this.userModel.findOne({
        where: { id: userId },
        relations: { profile: true },
      });

      if (user) {
        await this.userModel.remove(user);
      }

      return {
        code: HttpStatus.OK,
        message: 'User removed successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
