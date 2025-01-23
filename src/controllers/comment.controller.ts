import {inject} from '@loopback/core';
import {
  get,
  post,
  put,
  del,
  param,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings} from '@loopback/security';
import {Context} from '@loopback/context';
import {CommentRepository} from '../repositories/comment.repository';
import {Comment} from '../models/comment.model';

export class CommentController {
  constructor(
    @inject('repositories.CommentRepository')
    private commentRepository: CommentRepository,
    @inject.context() private ctx: Context,
  ) {}

  // @authenticate('jwt')
  // @post('/comments')
  // async createComment(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: {
  //           type: 'object',
  //           required: ['content', 'postId'],
  //           properties: {
  //             content: {type: 'string'},
  //             postId: {type: 'number'},
  //           },
  //         },
  //       },
  //     },
  //   })
  //   commentData: Omit<Comment, 'id' | 'userId'>,
  // ): Promise<Comment> {
  //   const user = await this.ctx.get(SecurityBindings.USER);
  //   return this.commentRepository.create({
  //     ...commentData,
  //     userId: user.userId,
  //   });
  // }

  @post('/comments')
  async createComment(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['content', 'postId', 'userId'],
            properties: {
              content: {type: 'string'},
              postId: {type: 'number'},
              userId: {type: 'string'},
            },
          },
        },
      },
    })
    commentData: Comment,
  ): Promise<Comment> {
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