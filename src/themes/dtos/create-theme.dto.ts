import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateThemeDto {
  @IsNotEmpty()
  @IsString()
  @Length(3)
  title: string;

  @IsOptional()
  @IsString()
  keywords: string;
}