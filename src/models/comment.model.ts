import {Model, model, property} from '@loopback/repository';

@model()
export class Comment extends Model {
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
  content: string;

  @property({
    type: 'number',
    required: true,
  })
  postId: number;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
} 