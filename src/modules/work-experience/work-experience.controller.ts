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
import { WorkExperienceService } from './work-experience.service';
import { successResponse } from 'src/common/response';

@Controller('work-experiences')
export class WorkExperienceController {
  constructor(private readonly workExperienceService: WorkExperienceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.workExperienceService.create(userId, body);
    return successResponse(data, 'Work experience created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.workExperienceService.findAll(Number(page), Number(limit), search, order);
    return successResponse(data, 'Work experiences fetched successfully');
  }
  @Get('get-all-showcase')
  async findAllForShowcase(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.workExperienceService.findAll(Number(page), Number(limit), search, order);
    return successResponse(data, 'Work experiences fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.workExperienceService.findOne(id);
    return successResponse(data, 'Work experience fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.workExperienceService.update(id, userId, body);
    return successResponse(data, 'Work experience updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    await this.workExperienceService.remove(id, userId);
    return successResponse(null, 'Work experience deleted successfully');
  }
}