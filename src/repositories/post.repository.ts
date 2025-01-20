

import {Post} from '../models/post.model';
import {PrismaClient} from '@prisma/client';

export class PostRepository {
  prisma = new PrismaClient();

  async create(postData: Post): Promise<any> {
    const { id, ...dataWithoutId } = postData;  
    const post = await this.prisma.post.create({
      data: dataWithoutId, 
    });
    return post;
  }
  

  async find(): Promise<any> {
    return this.prisma.post.findMany();
  }

}
