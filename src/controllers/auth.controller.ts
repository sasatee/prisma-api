import {post, requestBody} from '@loopback/rest';
import {inject} from '@loopback/core';
import {AuthService} from '../services/auth.service';

export class AuthController {
  constructor(
    @inject('services.AuthService')
    private authService: AuthService,
  ) {}

  @post('/auth/register')
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string', minLength: 8},
            },
          },
        },
      },
    })
    credentials: {email: string; password: string},
  ) {
    return this.authService.register(credentials.email, credentials.password);
  }

  @post('/auth/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: {email: string; password: string},
  ) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @post('/auth/refresh-token')
  async refreshToken(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
              refreshToken: {type: 'string'},
            },
          },
        },
      },
    })
    {refreshToken}: {refreshToken: string},
  ) {
    return this.authService.refreshToken(refreshToken);
  }
} 