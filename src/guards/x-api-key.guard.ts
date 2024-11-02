import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigurationService } from 'src/config/configuration.service';

@Injectable()
export class XApiKeyGuard implements CanActivate {
  constructor(private readonly configurationService: ConfigurationService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey && apiKey === this.configurationService.apiKey) {
      return true;
    }
    throw new UnauthorizedException('Invalid API key');
  }
}
