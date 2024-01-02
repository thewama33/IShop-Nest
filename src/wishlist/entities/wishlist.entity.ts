import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/users/entity/users.entity';
import { AbstractEntity } from 'src/utils/entity.abstraction';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'wishlist' })
export class WishlistEntity extends AbstractEntity<WishlistEntity> {
  @Column()
  productId: string;

  @ManyToOne(() => UserEntity, (user) => user.wishlist)
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.wishlist)
  product: ProductEntity;
}
