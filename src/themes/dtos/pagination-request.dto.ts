import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance, Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationRequestDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public readonly page?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public readonly limit?: number;
}

export class PaginationRequestWithOffsetDto extends PaginationRequestDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  @IsOptional()
  public readonly offset?: number;
}

@Injectable()
export class PaginationTransformPipe implements PipeTransform {
  async transform(dto: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return dto;
    }

    const defaults = {
      page: 1,
      limit: 10,
      offset: 0,
    };

    const cleanDto = {
      ...dto,
      page: this.isValidNumber(dto.page) ? Number(dto.page) : defaults.page,
      limit: this.isValidNumber(dto.limit) ? Number(dto.limit) : defaults.limit,
      offset: this.isValidNumber(dto.offset)
        ? Number(dto.offset)
        : defaults.offset,
    };

    return plainToInstance(metatype, cleanDto);
  }

  private isValidNumber(value: any): boolean {
    return (
      value !== undefined && value !== null && value !== '' && !isNaN(value)
    );
  }
}
