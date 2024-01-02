import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartEntity } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartModel: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemModel: Repository<CartItemEntity>,
  ) {}

  async createCart(userId: number) {
    const cart = this.cartModel.create({ user: { id: userId } });

    await this.cartModel.save(cart);

    return {
      code: 200,
      message: 'Cart Created',
    };
  }

  async addItem(addToCartDto: AddToCartDTO) {
    console.log(`Data ${addToCartDto}`);

    const cartItem = this.cartItemModel.create(addToCartDto);

    await this.cartItemModel.save(cartItem);

    return {
      code: 200,
      message: 'Item Added Successfully',
    };
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
