import { AbstractEntity } from 'src/utils/entity.abstraction';
import { Column, Entity, ManyToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('tags')
export class TagsEntity extends AbstractEntity<TagsEntity> {
  @Column('varchar', { name: 'title', length: 75 })
  title: string;

  @Column('varchar', { name: 'metaTitle', nullable: true, length: 100 })
  metaTitle: string | null;

  @Column('varchar', { name: 'slug', length: 100 })
  slug: string;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @ManyToMany(() => ProductEntity, (product) => product.tags)
  products: ProductEntity[];
}
