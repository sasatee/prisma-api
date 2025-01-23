import {AuthenticationBindings, AuthenticationMetadata} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {HttpErrors, Middleware, MiddlewareContext} from '@loopback/rest';
import jwt from 'jsonwebtoken';

export class JWTAuthMiddleware  {
  constructor(

  ) {}

  async handle(context: MiddlewareContext, next: () => Promise<any>) {
    const {request} = context;
    const token = this.extractCredentials(request);
    
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      (request as any).user = payload;
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      );
    }

    return next();
  }

  private extractCredentials(request: any): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found');
    }

    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not of type Bearer',
      );
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        'Authorization header has too many parts',
      );
    }

    return parts[1];
  }
}