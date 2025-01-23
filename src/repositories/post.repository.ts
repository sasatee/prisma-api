import {PrismaClient} from '@prisma/client';
import {Post} from '../models/post.model';
import {HttpErrors} from '@loopback/rest';

export class PostRepository {
  prisma = new PrismaClient();

  async create(postData: Post): Promise<any> {
    const {id, createdAt, updatedAt, ...dataToCreate} = postData;

    if (!dataToCreate.userId) {
      throw new HttpErrors.BadRequest('userId is required');
    }

    const post = await this.prisma.post.create({
      data: dataToCreate,
      include: {
        user: true,
      },
    });
    return post;
  }

  async find(): Promise<any> {
    return this.prisma.post.findMany({
      include: {
        user: true,
        comments: true,
      },
    });
  }
}