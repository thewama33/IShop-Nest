import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,

    private readonly entityManager: EntityManager,
  ) {}
  async checkout(currentUser) {
    const userId = currentUser.id;

    // Get Cart and all items by user ID
    const userCart = await this.entityManager
      .createQueryBuilder(OrderEntity, 'orders')
      .innerJoinAndSelect('orders.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.product', 'product')
      .select([
        'product.id as productId',
        'orderItems.quantity as quantity',
        'orderItems.price as price',
        'orderItems.price  *  orderItems.quantity as totalPrice',
      ])
      .where('orders.userId = :userId', { userId: userId })
      .getRawMany();

    //Check if user has cart
    if (!userCart || userCart.length == 0) {
      throw new NotAcceptableException('User Cart not found');
    }

    // Check if the user has a order
    let order = await this.ordersRepository.findOne({
      where: {
        user: { id: userId },
      },
    });

    // Check if the user has a order
    if (!order) {
      order = this.ordersRepository.create({ user: { id: userId } });
      await this.ordersRepository.save(order);
    }

    let total = 0;

    const items = userCart.map((item) => {
      const newCartItem = this.entityManager.create(OrderItemEntity, {
        order: order,
        product: item.productid,
        quantity: item.quantity,
        price: parseInt(item.price),
        total: parseInt((item.price * item.quantity).toFixed(2)),
      });
      return newCartItem;
    });

    for (let i = 0; i < items.length; i++) {
      total += items[i].total;
    }

    console.log(items);
    console.log('Total: ' + total);

    await this.entityManager.transaction(async (ts) => {
      await ts.save(items);

      //Update cart isCompleted to TRUE when creating order is successful
      await ts
        .createQueryBuilder(CartEntity, 'cart')
        .update(CartEntity)
        .set({ isCompleted: true })
        .where('userId = :userId', { userId: userId })
        .execute();
    });

    return {
      code: HttpStatus.OK,
      message: 'Order created successfully',
    };
  }

  async findAll(currentUser) {
    const userId = currentUser.id;
    const order = await this.entityManager
      .createQueryBuilder(OrderEntity, 'orders')
      .innerJoinAndSelect('orders.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.product', 'product')
      .where('orders.userId = :userId', { userId: userId })
      .getMany();

    return {
      code: HttpStatus.OK,
      message: 'Results retrived successfully',
      data: order,
    };
  }

  findOne(currentUser, id: number) {
    const userId = currentUser.id;

    const order = this.entityManager
      .createQueryBuilder(OrderEntity, 'orders')
      .innerJoinAndSelect('orders.user', 'user')
      .innerJoinAndSelect('orders.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.product', 'product')
      .where('orders.userId = :userId', { userId: userId })
      .andWhere('orders.id = :id', { id: id })
      .getOne();

    return {
      code: HttpStatus.OK,
      message: 'Results retrived successfully',
      data: order,
    };
  }

  updateStatus(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
}
