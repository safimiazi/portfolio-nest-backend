import { Module } from '@nestjs/common';
import { CodingProfileController } from './coding-profile.controller';
import { CodingProfileService } from './coding-profile.service';

@Module({
  controllers: [CodingProfileController],
  providers: [CodingProfileService]
})
export class CodingProfileModule {}
