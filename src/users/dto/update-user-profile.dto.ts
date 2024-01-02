import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInfoDTO as CreateUserProfileDTO } from './create-user-profile.dto';

export class UpdateUserProfile extends PartialType(CreateUserProfileDTO) {}
