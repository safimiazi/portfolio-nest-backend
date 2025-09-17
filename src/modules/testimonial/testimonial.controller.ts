import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TestimonialService } from './testimonial.service';
import { successResponse } from 'src/common/response';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.testimonialService.create(userId, body);
    return successResponse(data, 'Testimonial created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.testimonialService.findAll(Number(page), Number(limit), search, order);
    return successResponse(data, 'Testimonials fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.testimonialService.findOne(id);
    return successResponse(data, 'Testimonial fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.testimonialService.update(id, userId, body);
    return successResponse(data, 'Testimonial updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    await this.testimonialService.remove(id, userId);
    return successResponse(null, 'Testimonial deleted successfully');
  }
}