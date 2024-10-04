import { PartialType } from '@nestjs/mapped-types';
import { CreateThemeDto } from './create-theme.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateThemeDto extends PartialType(CreateThemeDto) {
  @ApiPropertyOptional({
    example: 'new war title',
    description: 'valid title example',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'global politics',
    description: 'valid keywords example',
  })
  keywords: string;
}
