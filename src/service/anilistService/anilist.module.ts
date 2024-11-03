import { Global, Module } from '@nestjs/common';
import { ConfigurationModule } from '../../config/configuration.module';
import { AnilistService } from './anilist.service';

@Global()
@Module({
  imports: [ConfigurationModule],
  controllers: [],
  providers: [AnilistService],
  exports: [AnilistService],
})
export class AnilistModule {}
