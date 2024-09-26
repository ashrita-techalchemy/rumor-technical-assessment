import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { AxiosClient } from 'src/axios/axiosClient';
import { Product, ProductById } from './interfaces/product.interface';

interface ProductService {
    getProduct(data: ProductById): Observable<Product>;
  }

/**
 * Service responsible for managing orders.
 */
@Injectable()
export class OrderService extends AxiosClient {
    private axiosClient: AxiosClient;
    private productService: ProductService;
    constructor(
        @Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderDetails)
        private readonly orderDetailsRepository: Repository<OrderDetails>,
    ) {
        super()
        this.axiosClient = new AxiosClient();
    }

    onModuleInit() {
        this.productService = this.client.getService<ProductService>('ProductService');
    }

    /**
     * Places an order with the provided data.
     * @param orderData - The data of the order to be placed.
     * @returns A promise resolving with the created order.
     */
    async placeOrder(orderData) {
        console.log('orderData', orderData);

        const order = new Order();
        const savedOrder = await this.orderRepository.save(order);

        const productAvailabilityPromises = orderData.map(
            async ({ productId }) => {
                const product = this.productService.getProduct({ id: productId });
                product.subscribe({
                    next: (product: Product) => {
                        console.log('Product:', product);  // This is where you handle the response
                        Promise.all(productAvailabilityPromises);

                        const orderDetailsEntities = orderData.map(
                            ({ productId, quantity }) => {
                                const orderDetails = new OrderDetails();
                                orderDetails.order = savedOrder;
                                orderDetails.productId = productId;
                                orderDetails.quantity = quantity;
                                return orderDetails;
                            },
                        );

                        return this.orderDetailsRepository.save(orderDetailsEntities);
                    },
                    error: (err) => {
                      console.error('Error:', err);  // Handle any error from the gRPC call
                      return err;
                    },
                    complete: () => {
                      console.log('gRPC call completed');
                      return "gRPC call completed"
                    },
                });
            },
        );
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
        // let products = await this.getCall(`/products?ids=${productIds.join(",")}`);
        let products = [];
        for (let index=0; index<productIds.length; index++) {
            const product = await this.productService.getProduct({ id: productIds[index] });
            product.subscribe({
                next: (product: Product) => {
                  console.log('Product:', product);  // This is where you handle the response
                  products.push(product)
                },
                error: (err) => {
                  console.error('Error:', err);  // Handle any error from the gRPC call
                  return err;
                },
                complete: () => {
                  console.log('gRPC call completed');
                  return "gRPC call completed"
                },
            });
        }

        const productLookup = {};
        products.forEach(product => {
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
