import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { CartEntity } from './entities/cart.entity';

@Controller('api/carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId')
  async create(@Param('userId') userId: number) {
    return this.cartService.createCart(userId);
  }

  @Post('add')
  async addItemToCart(@Body() addToCartDto: AddToCartDTO) {
    console.log('Dataaaaaaaaa', addToCartDto);

    return this.cartService.addItem(addToCartDto);
  }

  @Get(':cartId')
  async findCartById(@Param('cartId') cartId: number) {
    return this.cartService.findOne(cartId);
  }

  @Patch(':cartId')
  async update(
    @Param('cartId') cartId: number,
    @Body() data: Partial<CartEntity>,
  ) {
    return this.cartService.update(cartId, data);
  }

  @Delete(':cartId')
  async delete(@Param('cartId') cartId: number) {
    return this.cartService.remove(cartId);
  }
}
