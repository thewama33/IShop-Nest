import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserInfoDTO as CreateUserProfileDTO } from './dto/create-user-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserProfile } from './dto/update-user-profile.dto';
import { Public } from 'src/utils/publicity.decorator';
import { CurrentUser } from 'src/utils/current-user.decorator';
import { UserEntity } from './entity/users.entity';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Post('profile')
  create(
    @CurrentUser() currentUser,
    @Body(new ValidationPipe()) createUserProfileDto: CreateUserProfileDTO,
  ) {
    return this.usersService.createUserProfile(createUserProfileDto, currentUser);
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('single')
  findOne(@CurrentUser() currentUser: any) {
    return this.usersService.findOne(currentUser);
  }

  @Patch('profile')
  update(@CurrentUser() currentUser, @Body() updateUserDto: UpdateUserProfile) {
    return this.usersService.updateUserProfile(updateUserDto, currentUser);
  }

  @Delete('delete')
  remove(@CurrentUser() currentUser: any) {
    return this.usersService.remove(currentUser);
  }
}
