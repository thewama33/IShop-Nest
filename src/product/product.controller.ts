import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { ProductService } from './product.service';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';

//@UseGuards(AuthenticationGuard)
@Controller('api/products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('seed')
  seed() {
    return this.productsService.seedProducts();
  }

  @Post()
  create(
    @Body(new ValidationPipe())
    createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto);
  }

  @Get('all')
  findAll(
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
  ) {
    console.log(`Page is : ${page} Limited Count : ${limit}`);

    return this.productsService.findAll(page, limit);
  }

  @Get()
  findOne(
    @Query('id')
    id: string,
  ) {
    return this.productsService.findOne(id);
  }

  // @Patch('update')
  // update(
  //   @Query('id') id: string,
  //   @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  // ) {
  //   return this.productsService.update(id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
