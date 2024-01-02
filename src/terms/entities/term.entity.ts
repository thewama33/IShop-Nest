import { AbstractEntity } from 'src/utils/entity.abstraction';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'terms' })
export class TermsEntity extends AbstractEntity<TermsEntity> {
  @Column({ nullable: true })
  type: string;

  @Column()
  title: string;

  @Column()
  content: string;
}
