import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderDetails]), HttpModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }
