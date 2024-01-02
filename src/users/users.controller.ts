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

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @Post('profile')
  create(
    @Req() request,
    @Body(new ValidationPipe()) createUserProfileDto: CreateUserProfileDTO,
  ) {
    return this.usersService.createUserProfile(createUserProfileDto, request);
  }

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('single')
  findOne(@Req() request) {
    return this.usersService.findOne(request);
  }

  @Patch('profile')
  update(@Req() request, @Body() updateUserDto: UpdateUserProfile) {
    return this.usersService.updateUserProfile(updateUserDto, request);
  }

  @Delete('delete')
  remove(@Req() request) {
    return this.usersService.remove(request);
  }
}
