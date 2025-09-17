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
import { SkillService } from './skill.service';
import { successResponse } from 'src/common/response';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.skillService.create(userId, body);
    return successResponse(data, 'Skill created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.skillService.findAll(Number(page), Number(limit), search, order);
    return successResponse(data, 'Skills fetched successfully');
  }
  @Get('get-all-for-showcase')
  async findAllData(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.skillService.findAll(Number(page), Number(limit), search, order);
    return successResponse(data, 'Skills fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.skillService.findOne(id);
    return successResponse(data, 'Skill fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.skillService.update(id, userId, body);
    return successResponse(data, 'Skill updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    await this.skillService.remove(id, userId);
    return successResponse(null, 'Skill deleted successfully');
  }
}