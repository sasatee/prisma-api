import {PrismaClient} from '@prisma/client';
import {Comment} from '../models/comment.model';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';

export class CommentRepository {
  prisma = new PrismaClient();

  async create(commentData: Comment): Promise<any> {
    const {id, createdAt, updatedAt, ...dataToCreate} = commentData;
    
    
    if (!dataToCreate.userId || !dataToCreate.postId) {
      throw new HttpErrors.BadRequest('Both userId and postId are required');
    }

    const comment = await this.prisma.comment.create({
      data: dataToCreate,
      include: {
        user: true,
        post: true,
      },
    });
    return comment;
  }

  async find(): Promise<any> {
    return this.prisma.comment.findMany({
      include: {
        post: true,
        user: true,
      },
    });
  }

  async findByPostId(postId: number): Promise<any> {
    return this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: true,
      },
    });
  }
} 