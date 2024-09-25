import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('orderDetails')
export class OrderDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.orderDetails)
    order: Order;

    @Column()
    productId: number;

    @Column()
    quantity: number;
}
