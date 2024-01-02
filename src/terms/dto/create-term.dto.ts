import { IsString } from 'class-validator';

export class CreateTermDto {
  @IsString()
  type: string;

  @IsString()
  title: string;
  @IsString()
  content: string;
}
