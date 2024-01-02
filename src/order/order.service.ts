import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    private readonly cartService: CartService,
    private readonly entitymanager: EntityManager,
  ) {}
  async checkout(
    currentUser,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    const userId = currentUser.id;
    const userCart = await this.cartService.getUserCart(userId);

    // Implement logic to validate items in the cart, calculate total, and create an order

    const order = await this.ordersRepository.create({
      ...createOrderDto,
    });

    await this.entitymanager.transaction(async (transaction) => {
      await transaction.save(order);
    });

    // await this.cartService.clearCart(userCart.data);

    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
