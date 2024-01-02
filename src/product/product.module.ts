import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { VariantEntity } from './entities/variants.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, VariantEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
