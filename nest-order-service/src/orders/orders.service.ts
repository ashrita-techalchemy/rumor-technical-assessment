import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { AxiosClient } from 'src/axios/axiosClient';

/**
 * Service responsible for managing orders.
 */
@Injectable()
export class OrderService extends AxiosClient {
    private axiosClient: AxiosClient;
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetails)
        private readonly orderDetailsRepository: Repository<OrderDetails>,
    ) {
        super()
        this.axiosClient = new AxiosClient();
    }

    /**
     * Places an order with the provided data.
     * @param orderData - The data of the order to be placed.
     * @returns A promise resolving with the created order.
     */
    async placeOrder(orderData): Promise<Order> {
        console.log('orderData', orderData);

        const order = new Order();
        const savedOrder = await this.orderRepository.save(order);

        const productAvailabilityPromises = orderData.map(
            async ({ productId }) => {
                const product = await this.getCall(`/products/${productId}`);
                if (!product.success || product.data.quantity === 0) {
                    await this.orderRepository.delete(savedOrder.id);
                    throw new Error('Product not available or insufficient quantity');
                }
            },
        );

        await Promise.all(productAvailabilityPromises);

        const orderDetailsEntities = orderData.map(
            ({ productId, quantity }) => {
                const orderDetails = new OrderDetails();
                orderDetails.order = savedOrder;
                orderDetails.productId = productId;
                orderDetails.quantity = quantity;
                return orderDetails;
            },
        );

        return await this.orderDetailsRepository.save(orderDetailsEntities);
    }

    /**
     * Retrieves a list of all orders with product details.
     * @returns A promise resolving with the list of orders.
     */
    async listOrders(): Promise<Order[]> {
        const orders = await this.orderRepository.find({
            relations: ['orderDetails'],
            select: {
                id: true,
                createdAt: true,
                orderDetails: {
                    productId: true,
                    quantity: true,
                },
            },
        });
        const productIds: number[] = orders.flatMap(order =>
            order.orderDetails.map(orderDetail => orderDetail.productId)
        );
        const products = await this.getCall(`/products?ids=${productIds.join(",")}`);

        const productLookup = {};
        products.data.forEach(product => {
            productLookup[product.id] = product;
        });

        // Iterate through orders and details
        orders.forEach(order => {
            order.orderDetails.forEach(detail => {
                const product = productLookup[detail.productId];
                if (product) {
                    detail["productName"] = product.name;
                }
            });
        });
        return orders
    }
}
