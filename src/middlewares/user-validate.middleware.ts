import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { NextFunction } from 'express';
import { UserEntity } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';

config();

@Injectable()
export class UserValidateMiddlewareMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userModel: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Headers : ', req.headers);

    // Get the JWT token from the request headers
    const token = req.headers['authorization'].split(' ')[1];

    console.log('Token is ', token);

    // Verify the token and extract the payload
    const payload = this.jwtService.verify(token);

    console.log('Payload : ', payload);

    // Check if the user ID is valid
    if (!payload || !payload['user']['id']) {
      // Handle the invalid user ID case
      throw new NotFoundException('Invalid user id');
    }

    const user = await this.userModel.findOneBy({ id: payload['user']['id'] });

    if (!user) throw new NotFoundException('Invalid user id');

    // Attach the user ID to the request object for future use
    req['id'] = payload['user']['id'];

    // Call the next middleware or route handler
    next();
  }
}
