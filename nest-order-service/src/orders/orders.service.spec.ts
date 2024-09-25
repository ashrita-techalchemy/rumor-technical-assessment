import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { CreateOrderDtoArray } from './dto/create-order.dto';

/**
 * MockType represents a mock object with methods replaced by Jest mock functions.
 * @template T - The type of the object being mocked.
 */
export type MockType<T> = {
    [P in keyof T]?: jest.Mock<object>;
};

/**
 * repositoryMockFactory generates a mock repository object for testing purposes.
 * @returns A mock repository object.
 */
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
    () => ({
        find: jest.fn((entity) => entity),
        save: jest.fn((entity) => entity),
    }),
);

describe('OrderService', () => {
    let orderService: OrderService;
    let repositoryMock: MockType<Repository<Order>>;
    let orderDetailsRepositoryMock: MockType<Repository<OrderDetails>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                OrderDetails,
                {
                    provide: getRepositoryToken(Order),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(OrderDetails),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        orderService = module.get<OrderService>(OrderService);
        repositoryMock = module.get(getRepositoryToken(Order));
        orderDetailsRepositoryMock = module.get(
            getRepositoryToken(OrderDetails),
        );
    });

    it('order service should be defined', () => {
        expect(orderService).toBeDefined();
    });

    it('should get all orders', async () => {
        expect(await orderService.listOrders());
    });

    it('should place an orders', async () => {
        const createOrderDto: CreateOrderDtoArray = [
            { productId: 1, quantity: 10 },
        ];
        expect(await orderService.placeOrder(createOrderDto));
    });
});
