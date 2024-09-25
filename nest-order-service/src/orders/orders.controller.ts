import { Controller, Post, Get, Body, HttpStatus } from '@nestjs/common';
import { OrderService } from './orders.service';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { CreateOrderDto, CreateOrderDtoArray } from './dto/create-order.dto';

/**
 * Controller handling operations related to orders.
 * - Requires Bearer authentication.
 * - Tagged under 'Orders' for API documentation.
 */
@ApiTags('orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    /**
     * Endpoint to create a new order.
     * @param orderData Data required to create the order.
     * @returns A success response with the created order, or an error message.
     */
    @Post()
    @ApiOperation({ summary: 'Create Product' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The order has been successfully placed.',
    })
    @ApiBody({ type: [CreateOrderDto] })
    async placeOrder(@Body() orderData: CreateOrderDtoArray) {
        try {
            const order = await this.orderService.placeOrder(orderData);
            return { status: HttpStatus.CREATED, success: true, data: order };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Endpoint to retrieve a list of all orders.
     * @returns A success response with the list of orders, or an error message.
     */
    @Get()
    @ApiOperation({ summary: 'List of all orders' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of orders',
        type: Order,
    })
    async listOrders() {
        try {
            const orders = await this.orderService.listOrders();
            return { status: HttpStatus.OK, success: true, data: orders };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}
