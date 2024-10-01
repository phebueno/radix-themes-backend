import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateThemeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  keywords: string;
}