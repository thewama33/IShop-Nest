import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/constants/enums';

export const Roles = (...roles: Role[]) => SetMetadata('Roles', roles);
