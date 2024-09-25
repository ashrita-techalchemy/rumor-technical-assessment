import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    productId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export type CreateOrderDtoArray = CreateOrderDto[];
