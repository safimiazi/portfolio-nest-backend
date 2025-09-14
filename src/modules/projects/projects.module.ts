import { Module } from '@nestjs/common';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';


@Module({
  controllers: [ProjectController],
  providers: [ProjectService, CloudinaryService]
})
export class ProjectsModule {}
