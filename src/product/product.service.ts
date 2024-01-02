import { faker } from '@faker-js/faker';
import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';

import { CreateProductDto } from '../product/dto/create-product.dto';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { max, min } from 'class-validator';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productModel: Repository<ProductEntity>,
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

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.findOneBy({
      title: createProductDto.title,
    });

    if (product) throw new NotAcceptableException('Product is Already Exists');

    const isCreated = this.productModel.create(createProductDto);

    console.log(createProductDto);

    if (!isCreated) throw new NotAcceptableException('Something went wrong');

    return { status: HttpStatus.OK, message: 'Product Added Successfully!' };
  }

  async findAll(page: number, limit: number) {
    const totalProducts = (await this.productModel.find()).length;

    const totalPages =
      Math.ceil(totalProducts / Number(limit) - 1) < 0
        ? 0
        : Math.ceil(totalProducts / Number(limit) - 1);

    const products = await this.productModel.find();
    // .find({ skip: Number(page) * Number(limit),comment limit: Number(limit) })

    console.log(products);

    return {
      code: HttpStatus.OK,
      message: 'Results retrived successfully',
      data: products,
      page: totalPages,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findOneBy({ id: +id });

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
