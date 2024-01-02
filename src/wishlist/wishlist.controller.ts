import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { CurrentUser } from 'src/utils/current-user.decorator';

@Controller('/api/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(
    @CurrentUser() currentUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistService.addWishlistItem(currentUser, createWishlistDto);
  }

  @Get()
  findAll(@CurrentUser() currentUser) {
    return this.wishlistService.getWishlist(currentUser);
  }

  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.wishlistService.removeWishlistItem(currentUser, +id);
  }
}
