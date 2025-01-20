import {Model, model, property} from '@loopback/repository';

@model()
export class Post extends Model {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  constructor(data?: Partial<Post>) {
    super(data);
  }
}
