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
import { CodingProfileService } from './coding-profile.service';
import { successResponse } from 'src/common/response';

@Controller('coding-profiles')
export class CodingProfileController {
  constructor(private readonly codingProfileService: CodingProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body: any, @Req() req: any) {
    const userId = req.user.userId;
    const data = await this.codingProfileService.create(userId, body);
    return successResponse(data, 'Coding profile created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.codingProfileService.findAll(
      Number(page),
      Number(limit),
      search,
      order,
    );
    return successResponse(data, 'Coding profiles fetched successfully');
  }

  @Get('get-all-for-showcase')
  async findAllForShowcase(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.codingProfileService.findAll(
      Number(page),
      Number(limit),
      search,
      order,
    );
    return successResponse(data, 'Coding profiles fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.codingProfileService.findOne(id);
    return successResponse(data, 'Coding profile fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const data = await this.codingProfileService.update(id, userId, body);
    return successResponse(data, 'Coding profile updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    await this.codingProfileService.remove(id, userId);
    return successResponse(null, 'Coding profile deleted successfully');
  }
}
