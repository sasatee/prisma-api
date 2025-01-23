import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import { JWTAuthMiddleware } from './middlewares/auth.middleware';
import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {TokenServiceBindings} from './keys';
import {JWTService} from './services/jwt.service';


export {ApplicationConfig};

export class LoopbackPrismaApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up authentication
    this.component(AuthenticationComponent);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.add(createBindingFromClass(JWTAuthenticationStrategy, {
      key: 'authentication.strategies.jwt',
    }));
    
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));


  

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
