import { faker } from '@faker-js/faker';
import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productModel: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryModel: Repository<CategoryEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async seedProducts() {
    const data = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: parseInt(faker.commerce.price({ min: 1000, max: 10000 })),
      image: faker.image.urlPlaceholder({ format: 'jpeg' }),
    };

    const product = this.productModel.create(data);

    await this.productModel.save(product);
    return {
      code: 200,
      message: 'Product seed',
      data: product,
    };
  }

  async createProduct(categoryId: number, createProductDto: CreateProductDto) {
    console.log('category id :', categoryId);

    const product = await this.productModel.findOneBy({
      title: createProductDto.title,
    });

    const category = await this.categoryModel.findOneBy({ id: categoryId });

    console.log(category);

    if (!category) throw new NotFoundException('Category is not Exists');
    if (product) throw new NotAcceptableException('Product is Already Exists');

    const isProductCreated = this.productModel.create(createProductDto);

    isProductCreated.category = [category];

    console.log(createProductDto);

    if (!isProductCreated)
      throw new NotAcceptableException('Something went wrong');

    await this.productModel.save(isProductCreated);

    return { status: HttpStatus.OK, message: 'Product Added Successfully!' };
  }

  async findAll(page: number, limit: number) {
    const products = await this.productModel
      .createQueryBuilder('product')
      .andWhere('product.stock > 0')
      .skip(Number(page) * Number(limit))
      .take(Number(limit))
      .getMany();

    // .find({
    //   skip: Number(page) * Number(limit),
    //   take: Number(limit),
    // });

    console.log(products);

    return {
      code: HttpStatus.OK,
      message: 'Results retrived successfully',
      data: products,
    };
  }

  async findOne(id: number) {
    // const product = await this.productModel.findOneBy({ id: +id });

    const product = await this.productModel
      .createQueryBuilder('product')
      .where('product.id = :id', { id: id })
      .innerJoinAndSelect(
        'product.variants',
        'variants',
        'variants.productId = :id',
        { id: id },
      )
      .getOne();

    console.log('product ID : ' + id);

    if (!product) {
      throw new NotFoundException('Product not found!');
    }
    return {
      code: HttpStatus.OK,
      message: 'Results Retrived Successfully',
      data: product,
    };
  }

  // async update(id: string, updateProductDto: UpdateProductDto): Promise<any> {
  //   try {
  //     const product = await this.productModel.findOneBy({ id: +id });

  //     if (!product) {
  //       throw new NotFoundException('User Not Found');
  //     }

  //     await this.productModel.findByIdAndUpdate(id, updateProductDto).exec();

  //     // await this.productModel
  //     //   .findOneAndUpdate({
  //     //     where: { id },
  //     //     data: updateProductDto,
  //     //   })
  //     //   .exec();

  //     return {
  //       status: HttpStatus.OK,
  //       message: 'Product Updated Successfully!',
  //     };
  //   } catch (error) {
  //     throw new NotFoundException('Product Not Found');
  //   }
  // }

  // async remove(id: number) {
  //   const product = await this.productModel
  //     .remove({
  //       where: { id: id },
  //     })
  //     .exec();

  //   if (!product) throw new NotFoundException('Product Not Found!');

  //   return {
  //     code: HttpStatus.OK,
  //     message: `Item has been deleted`,
  //   };
  // }
}
