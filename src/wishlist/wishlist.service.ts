import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistEntity } from './entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
  ) {}
  async addWishlistItem(currentUser, createWishlistDto: CreateWishlistDto) {
    // Check if the product is already in the wishlist
    const product = await this.wishlistRepository.findOne({
      where: {
        user: { id: currentUser.id },
        productId: createWishlistDto.productId,
      },
    });

    // Check if the product is already in the wishlist
    if (product) {
      throw new NotAcceptableException('Product already in wishlist');
    }

    // Add the product to the wishlist
    const wishlist = this.wishlistRepository.create();

    wishlist.productId = createWishlistDto.productId;
    wishlist.user = currentUser.id;

    // Save the wishlist
    await this.wishlistRepository.save(wishlist);

    return {
      code: HttpStatus.OK,
      message: 'Wishlist item added successfully',
    };
  }

  async getWishlist(currentUser) {
    const userId = currentUser.id;

    // const wishlist = await this.wishlistRepository.find({
    //   where: {
    //     user: {
    //       id: userId,
    //     },
    //   },
    //   relations: {
    //     product: {
    //       category: true,
    //       variants: true,
    //       tags: true,
    //     },
    //   },
    // });
    const wishlist = await this.entityManager
      .createQueryBuilder(WishlistEntity, 'wishlist')
      .innerJoinAndSelect('wishlist.product', 'product')
      .leftJoin('wishlist.user', 'user')
      .where('wishlist.userId = :userId', { userId })
      .getMany();

    return {
      code: HttpStatus.OK,
      message: 'Results retrived successfully',
      data: wishlist,
    };
  }

  async removeWishlistItem(currentUser, id: number) {
    const userId = currentUser.id;

    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });

    if (!wishlist) {
      throw new NotAcceptableException('Wishlist item not found');
    }

    await this.wishlistRepository.remove(wishlist);

    return {
      code: HttpStatus.OK,
      message: 'Wishlist item removed successfully',
    };
  }
}
