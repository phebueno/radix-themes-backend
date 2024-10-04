import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateThemeDto {
  @IsNotEmpty()
  @IsString()
  @Length(3)
  @ApiProperty({ example: 'war on terror', description: "valid title example" })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3)
  @ApiProperty({ example: 'president influence', description: "valid keywords example" })
  keywords: string;
}