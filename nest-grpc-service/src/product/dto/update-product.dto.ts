import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object (DTO) for updating an existing product.
 * Inherits properties from CreateProductDto but makes them optional.
 */
export class UpdateProductDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quantity: number;
}
