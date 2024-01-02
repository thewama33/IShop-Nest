import { IsNumber, IsString } from 'class-validator';

export class CreateUserInfoDTO {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsNumber()
  age: number;
  @IsString()
  phoneNumber: string;
  @IsString()
  address: string;
  @IsString()
  city: string;
  @IsString()
  country: string;
}
