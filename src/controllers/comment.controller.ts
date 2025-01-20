import {inject} from '@loopback/core';
import {CommentRepository} from '../repositories/comment.repository';
import {get, post, param, requestBody} from '@loopback/rest';
import {Comment} from '../models/comment.model';

export class CommentController {
  constructor(
    @inject('repositories.CommentRepository')
    private commentRepository: CommentRepository,
  ) {}

  @post('/comments')
  async createComment(@requestBody() commentData: Comment): Promise<Comment> {
    return this.commentRepository.create(commentData);
  }

  @get('/comments')
  async findAllComments(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  @get('/posts/{postId}/comments')
  async findCommentsByPostId(
    @param.path.number('postId') postId: number,
  ): Promise<Comment[]> {
    return this.commentRepository.findByPostId(postId);
  }
} 