

import {inject} from '@loopback/core';
import {PostRepository} from '../repositories/post.repository';
import {get, post, requestBody} from '@loopback/rest';
import {Post} from '../models/post.model';

export class PostController {
  constructor(
    @inject('repositories.PostRepository') private postRepository: PostRepository,
  ) {}

  @post('/posts')
  async createPost(@requestBody() postData: Post): Promise<Post> {
    return this.postRepository.create(postData);
  }

  @get('/posts')
  async findAllPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }
}
