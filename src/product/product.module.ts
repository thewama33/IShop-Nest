import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { VariantEntity } from './entities/variants.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryModule } from 'src/category/category.module';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { CartItemEntity } from 'src/cart/entities/cart-item.entity';
import { TagsEntity } from './entities/tags.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      VariantEntity,
      TagsEntity,
      CategoryEntity,
      CartItemEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
