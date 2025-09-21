import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestimonialService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) { }
  // Upload avatar to Cloudinary
  private async uploadAvatar(file: Express.Multer.File): Promise<string> {
    try {
      const result = await this.cloudinary.uploadBuffer(
        file.buffer,
        'portfolio',
        'image',
      );
      return result.secure_url;
    } catch (err) {
      throw new InternalServerErrorException(
        'Avatar upload failed: ' + err.message,
      );
    }
  }
  async create(userId: number, data: any, file?: Express.Multer.File,
  ) {
    let avatarUrl
    if (file) {
      avatarUrl = await this.uploadAvatar(file);
    }
    return this.prisma.testimonial.create({
      data: {
        userId,
        name: data.name,
        position: data.position,
        content: data.content,
        avatar: avatarUrl,
      },
    });
  }

  async findAll(page: number, limit: number, search?: string, order: 'asc' | 'desc' = 'desc') {
    const where: any = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.testimonial.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: order },
      }),
      this.prisma.testimonial.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  async update(
    id: number,
    userId: number,
    data: any,
    file?: Express.Multer.File,
  ) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    if (testimonial.userId !== userId)
      throw new ForbiddenException('You are not allowed to update this testimonial');

    let avatarUrl = testimonial.avatar;

    // ✅ If a new avatar file is uploaded, upload to Cloudinary
    if (file) {
      avatarUrl = await this.uploadAvatar(file);
    }

    return this.prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name ?? testimonial.name,
        position: data.position ?? testimonial.position,
        content: data.content ?? testimonial.content,
        avatar: avatarUrl,
      },
    });
  }


  async remove(id: number, userId: number) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    if (testimonial.userId !== userId) throw new ForbiddenException('You are not allowed to delete this testimonial');
    await this.prisma.testimonial.delete({ where: { id } });
    return true;
  }
}