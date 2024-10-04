import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export function ApiSearchNewsResponses() {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Links created successfully.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Theme not found.',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: "Theme's search has already been done before.",
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: "Something went wrong with gdeltproject's API search.",
    }),
  );
}
