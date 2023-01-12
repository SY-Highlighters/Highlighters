import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super({
      accesstype: 'offline',
    });
  }
  // async canActivate(context: ExecutionContext) {
  //   const activate = (await super.canActivate(context)) as boolean;
  //   const request = context.switchToHttp().getRequest();
  //   await super.logIn(request);
  //   return activate;
  // }
}
