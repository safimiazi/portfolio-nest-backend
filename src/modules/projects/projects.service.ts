import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) { }

  // ✅ Upload helper
  private async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploads = await Promise.all(
        files.map((file) =>
          this.cloudinary.uploadBuffer(file.buffer, 'portfolio', 'image'),
        ),
      );
      return uploads.map((u) => u.secure_url);
    } catch (err) {
      throw new InternalServerErrorException('Image upload failed: ' + err.message);
    }
  }

  // ✅ Create project
  async create(userId: number, data: any, files: Express.Multer.File[]) {
    const imageUrls = files.length ? await this.uploadImages(files) : [];
    return this.prisma.project.create({
      data: {
        userId,
        title: data.title,
        liveLink: data.liveLink,
        githubFrontendLink: data.githubFrontendLink,
        githubBackendLink: data.githubBackendLink,
        shortDesc: data.shortDesc,
        detailsDesc: data.detailsDesc,
        status: data.status,
        isFeatured: data.isFeatured === 'true',
        usedTechnologies: data.usedTechnologies
          ? JSON.parse(data.usedTechnologies)
          : [],
        images: imageUrls,
      },
    });
  }

  // ✅ Get all projects with pagination & search
  async findAll(
    page: number,
    limit: number,
    search?: string,
    order: 'asc' | 'desc' = 'desc',
  ) {
    const where: any = search
      ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { shortDesc: { contains: search, mode: 'insensitive' } },
          { detailsDesc: { contains: search, mode: 'insensitive' } },
        ],
      }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: order },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  // ✅ Get all projects for showcase
  async findAllForShowcase(
    page: number,
    limit: number,
    search?: string,
    isFeatured?: boolean,
    order: 'asc' | 'desc' = 'desc',
  ) {
    const where: any = {};

    // search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
        { detailsDesc: { contains: search, mode: 'insensitive' } },
      ];
    }

    // featured filter
    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: order },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  // ✅ Get single project
  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  // ✅ Update project (only owner can update)
  async update(id: number, userId: number, data: any, files: Express.Multer.File[]) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this project');
    }

    let imageUrls = project.images;
    if (files.length) {
      const uploaded = await this.uploadImages(files);
      imageUrls = [...imageUrls, ...uploaded]; // append new images
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        title: data.title ?? project.title,
        liveLink: data.liveLink ?? project.liveLink,
        githubFrontendLink: data.githubFrontendLink ?? project.githubFrontendLink,
        githubBackendLink: data.githubBackendLink ?? project.githubBackendLink,
        shortDesc: data.shortDesc ?? project.shortDesc,
        detailsDesc: data.detailsDesc ?? project.detailsDesc,
        status: data.status ?? project.status,
        isFeatured:
          data.isFeatured !== undefined
            ? data.isFeatured === 'true'
            : project.isFeatured,
        usedTechnologies: data.usedTechnologies
          ? JSON.parse(data.usedTechnologies)
          : project.usedTechnologies,
        images: imageUrls,
      },
    });
  }

  // ✅ Delete project (only owner can delete)
  async remove(id: number, userId: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this project');
    }

    await this.prisma.project.delete({ where: { id } });
    return true;
  }
}
