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
import { LearningGoalService } from './learning-goal.service';
import { successResponse } from 'src/common/response';

@Controller('learning-goals')
export class LearningGoalController {
  constructor(private readonly learningGoalService: LearningGoalService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.learningGoalService.create(userId, body);
    return successResponse(data, 'Learning goal created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.learningGoalService.findAll(Number(page), Number(limit), search, order);
    return successResponse(data, 'Learning goals fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.learningGoalService.findOne(id);
    return successResponse(data, 'Learning goal fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.learningGoalService.update(id, userId, body);
    return successResponse(data, 'Learning goal updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    await this.learningGoalService.remove(id, userId);
    return successResponse(null, 'Learning goal deleted successfully');
  }
}