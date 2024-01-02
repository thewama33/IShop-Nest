import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryModel: Repository<CategoryEntity>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    await this.entityManager
      .createQueryBuilder(CategoryEntity, 'category')
      .insert()
      .into(CategoryEntity)
      .values([createCategoryDto])
      .execute();

    return {
      code: HttpStatus.OK,
      message: 'Data Inserted Successfully',
    };
  }

  async findAll() {
    const categories = await this.entityManager
      .createQueryBuilder(CategoryEntity, 'category')
      .select([
        'category.id as id',
        'category.name as name',
        'category.image as image',
      ])
      .getRawMany();

    return {
      code: HttpStatus.OK,
      message: 'Results fetched successfully',
      data: categories,
    };
  }

  async findOne(categoryId: number) {
    const category = await this.entityManager
      .createQueryBuilder(CategoryEntity, 'category')
      .where('category.id = :categoryId', { categoryId: categoryId })
      .innerJoinAndSelect('category.product', 'product')
      .getOne();

    console.log(category);

    return {
      code: HttpStatus.OK,
      message: 'Results fetched successfully',
      data: category,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.categoryModel.update(id, {
      ...updateCategoryDto,
    });
    return {
      code: HttpStatus.OK,
      message: 'Data Updated Successfully',
    };
  }

  async remove(id: number) {
    await this.categoryModel.delete(id);
    return {
      code: HttpStatus.OK,
      message: 'Category Deleted Successfully',
    };
  }
}
