import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { successResponse } from 'src/common/response';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role-auth.guard';
import { ProjectService } from './projects.service';


@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard) // ✅ All routes are protected
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // ✅ Create Project
  @Post('create-project')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async create(
    @Body() body: any,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Req() req: any,
  ) {
    console.log("body", body)
    const userId = req.user.userId; // ✅ Get userId from JWT
    const data = await this.projectService.create(
      userId,
      body,
      files?.images || [],
    );
    return successResponse(data, 'Project created successfully');
  }

  // ✅ Get all projects with pagination & search
  @Get('get-all-project')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const data = await this.projectService.findAll(
      Number(page),
      Number(limit),
      search,
      order,
    );
    return successResponse(data, 'Projects fetched successfully');
  }

  // ✅ Get single project
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.projectService.findOne(id);
    return successResponse(data, 'Project fetched successfully');
  }

  // ✅ Update project (only owner can update)
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Req() req: any,
  ) {
    const userId = req.user.userId; // ✅ Get userId from JWT
    const data = await this.projectService.update(
      id,
      userId,
      body,
      files?.images || [],
    );
    return successResponse(data, 'Project updated successfully');
  }

  // ✅ Delete project (only owner can delete)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId; // ✅ Get userId from JWT
    await this.projectService.remove(id, userId);
    return successResponse(null, 'Project deleted successfully');
  }
}
