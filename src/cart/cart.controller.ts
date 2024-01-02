import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { CurrentUser } from 'src/utils/current-user.decorator';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@UseGuards()
@Controller('/api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addItemToCart(
    @CurrentUser() currentUser,
    @Body() createCartDto: CreateCartItemDto,
  ) {
    return this.cartService.addToCart(currentUser, createCartDto);
  }

  @Get()
  getUserCart(@CurrentUser() currentUser) {
    return this.cartService.getUserCart(currentUser);
  }

  @Patch()
  updateCart(@CurrentUser() currentUser, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCartItemQuantity(currentUser, updateCartDto);
  }

  @Delete()
  removeItemFromCart(@Body('itemId') id: number) {
    return this.cartService.removeItemFromCart(+id);
  }
}
