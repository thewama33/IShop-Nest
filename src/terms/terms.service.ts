import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { TermsEntity } from './entities/term.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(TermsEntity)
    private readonly termsService: Repository<TermsEntity>,
  ) {}
  async create(createTermDto: CreateTermDto) {
    await this.termsService.save(createTermDto);
    return {
      code: HttpStatus.OK,
      message: 'Terms Created Successfully',
    };
  }

  async findAll() {
    const terms = await this.termsService
      .createQueryBuilder('terms')
      .getRawMany();

    return {
      code: HttpStatus.OK,
      message: 'Results Fetched Successfully',
      data: terms,
    };
  }

  findOne(id: number) {
    const term = this.termsService
      .createQueryBuilder('terms')
      .where('terms.id = :id', { id: id })
      .getOne();

    return {
      code: HttpStatus.OK,
      message: 'Results Fetched Successfully',
      data: term,
    };
  }

  async update(id: number, updateTermDto: UpdateTermDto) {
    await this.termsService.update(id, { ...updateTermDto });
    return {
      code: HttpStatus.OK,
      message: 'Terms Updated Successfully',
    };
  }

  async remove(id: number) {
    await this.termsService.delete(id);

    return {
      code: HttpStatus.OK,
      message: 'Terms Deleted Successfully',
    };
  }
}
