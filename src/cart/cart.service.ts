import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartEntity } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async getUserCart(currentUser) {
    // Get the user's cart
    const userCart = await this.entityManager
      .createQueryBuilder(CartEntity, 'cart')
      .innerJoinAndSelect('cart.cartItems', 'cartItem')
      .innerJoinAndSelect('cartItem.product', 'product')
      .where('cart.userId = :userId', { userId: currentUser.id })
      .andWhere('cart.isCompleted = :isCompleted', { isCompleted: false })
      .select([
        'product.id as productId',
        'cartItem.quantity as quantity',
        'cartItem.price as price',
        'product.title as title',
        'product.images as image',
        'product.price as price',
        'product.stock as stock',
      ])
      .getRawMany();

    return {
      code: HttpStatus.OK,
      message: 'Results retrived successfully',
      data: userCart,
    };
  }

  async addToCart(
    currentUser,
    createCartDto: CreateCartItemDto,
  ): Promise<CartEntity> {
    const userId = currentUser.id;

    // Check if the user has a cart
    let cart = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        isCompleted: false,
      },
    });

    // If the user doesn't have a cart, create a new one
    if (!cart || cart.isCompleted == true) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
    }

    // Check if the product is already in the cart
    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id, isCompleted: false },
        product: { id: createCartDto.productId },
      },
    });

    if (existingCartItem) {
      // Update quantity if the product already exists in the cart
      existingCartItem.quantity += createCartDto.quantity;
      await this.cartItemRepository.save(existingCartItem);
    } else {
      // Add a new item to the cart if the product is not in the cart
      const newCartItem = this.cartItemRepository.create({
        cart,
        quantity: createCartDto.quantity,
        price: createCartDto.price,
        product: { id: createCartDto.productId },
      });
      await this.cartItemRepository.save(newCartItem);
    }

    return this.cartRepository.findOne({
      where: { user: { id: userId }, isCompleted: false },
      relations: {
        cartItems: {
          product: true,
        },
      },
    });
  }

  async updateCartItemQuantity(cartItemId, updateCartDto: UpdateCartDto) {
    const cartItem = await this.cartItemRepository.findOneBy({
      id: cartItemId,
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartDto.quantity;

    await this.cartItemRepository.save(cartItem);

    return cartItem;
  }

  async removeItemFromCart(cartItemId: number) {
    const cartItem = await this.cartItemRepository.findOneBy({
      id: cartItemId,
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);

    return {
      code: HttpStatus.OK,
      message: 'Item removed successfully',
    };
  }
}
