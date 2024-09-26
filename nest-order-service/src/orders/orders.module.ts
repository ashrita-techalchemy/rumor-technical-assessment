import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderDetails]), 
        HttpModule,
        ClientsModule.register([
            {
              name: 'PRODUCT_PACKAGE',
              transport: Transport.GRPC,
              options: {
                package: 'product',
                protoPath: join(__dirname, '../proto/product.proto'), // Path to proto file
                url: process.env.PRODUCT_GRPC_URL, // gRPC server URL (GRPC Service)
              },
            },
        ]),
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }
