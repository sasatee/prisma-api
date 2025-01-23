import {BindingKey} from '@loopback/core';
import {TokenService} from '@loopback/authentication';

export namespace TokenServiceBindings {
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}