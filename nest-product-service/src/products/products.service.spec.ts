import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ProductService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
        create: jest.fn((entity) => entity),
        save: jest.fn((entity) => entity),
        find: jest.fn((entity) => entity),
        findOne: jest.fn((entity) => entity),
        update: jest.fn((entity) => entity),
        delete: jest.fn((entity) => entity),
    }),
);

describe('ProductService', () => {
    let productService: ProductService;
    let repositoryMock: MockType<Repository<Product>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        productService = module.get<ProductService>(ProductService);
        repositoryMock = module.get(getRepositoryToken(Product));
    });

    it('product service should be defined', () => {
        expect(productService).toBeDefined();
    });

    it('should create product', async () => {
        const createUserDto: CreateProductDto = {
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            quantity: expect.any(Number),
        };
        expect(await productService.create(createUserDto));
    });

    it('should get all products', async () => {
        expect(await productService.findAll());
    });

    it('should get product details', async () => {
        expect(await productService.findOne(1));
    });

    it('should update product', async () => {
        const updateProductDto: UpdateProductDto = {
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            quantity: expect.any(Number),
        };
        expect(await productService.update(1, updateProductDto));
    });

    it('should delete product', async () => {
        expect(await productService.delete(1));
    });
});
