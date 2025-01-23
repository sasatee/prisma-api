import {inject} from '@loopback/core';
import {
  get,
  post,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Context} from '@loopback/context';
import {PostRepository} from '../repositories/post.repository';
import {Post} from '../models/post.model';

export class PostController {
  constructor(
    @inject('repositories.PostRepository')
    private postRepository: PostRepository,
    @inject.context() private ctx: Context,
  ) {}

  // @authenticate('jwt')
  // @post('/posts')
  // async createPost(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: {
  //           type: 'object',
  //           required: ['title', 'content'],
  //           properties: {
  //             title: {type: 'string'},
  //             content: {type: 'string'},
  //           },
  //         },
  //       },
  //     },
  //   })
  //   postData: Omit<Post, 'id' | 'userId'>,
  // ): Promise<Post> {
  //   const user = await this.ctx.get(SecurityBindings.USER);
  //   return this.postRepository.create({
  //     ...postData,
  //     userId: user.userId,
  //   });
  // }

  @post('/posts')
  async createPost(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['title', 'content', 'userId'],  
            properties: {
              title: {type: 'string'},
              content: {type: 'string'},
              userId: {type: 'string'}, 
            },
          },
        },
      },
    })
    postData: Post, 
     
  ): Promise<Post> {
    if (!postData.userId) {
      throw new HttpErrors.Unauthorized('User ID is required');
    }
    return this.postRepository.create(postData);
  }

  @get('/posts')
  async findAllPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }



 
}