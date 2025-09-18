import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Module({
  controllers: [TestimonialController],
  providers: [TestimonialService,CloudinaryService]
})
export class TestimonialModule {}
