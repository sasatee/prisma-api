import {PrismaClient} from '@prisma/client';
import {Comment} from '../models/comment.model';


export class CommentRepository {
  prisma = new PrismaClient();

  async create(commentData: Comment): Promise<any> {
    const {id, ...dataWithoutId} = commentData;
    const comment = await this.prisma.comment.create({
      data: dataWithoutId,
    });
    return comment;
  }

  async find(): Promise<any> {
    return this.prisma.comment.findMany({
      include: {
        post: true,
      },
    });
  }

  async findByPostId(postId: number): Promise<any> {
    return this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });
  }
}
