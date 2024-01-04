import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { CurrentUser } from 'src/utils/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

config();

@Controller('/api/orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  create(@CurrentUser() currentUser, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.checkout(currentUser);
  }

  @Get('/test')
  async test(): Promise<any> {
    const res = await firstValueFrom(
      this.httpService
        .post<Observable<AxiosResponse<any, any>>>(
          'https://accept.paymob.com/api/auth/tokens',
          {
            api_key: process.env.PAYMOB_TOKEN,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened! ' + error;
          }),
        ),
    );

    return {
      code: HttpStatus.OK,
      message: 'Results retrived successfully',
      data: res.data,
    };
  }

  @Get('testo')
  async testo(): Promise<any> {
    const data = await this.httpService.axiosRef.get(
      'https://jsonplaceholder.typicode.com/posts',
    );

    return data;
  }

  @Get()
  findAll(@CurrentUser() currentUser) {
    return this.orderService.findAll(currentUser);
  }

  @Get(':id')
  findOne(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.orderService.findOne(currentUser, +id);
  }
}
function fromFirstValue(
  arg0: Observable<AxiosResponse<Observable<AxiosResponse<any, any>>, any>>,
) {
  throw new Error('Function not implemented.');
}
