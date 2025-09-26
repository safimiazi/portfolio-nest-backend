import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CodingProfileService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    return this.prisma.codingProfile.create({
      data: {
        userId,
        platform: data.platform,
        username: data.username,
        profileUrl: data.profileUrl,
      },
    });
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    order: 'asc' | 'desc' = 'desc',
  ) {
    const where: any = search
      ? {
          OR: [
            { platform: { contains: search, mode: 'insensitive' } },
            { username: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.codingProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: order },
      }),
      this.prisma.codingProfile.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const profile = await this.prisma.codingProfile.findUnique({
      where: { id },
    });
    if (!profile) throw new NotFoundException('Coding profile not found');
    return profile;
  }

  async update(id: number, userId: number, data: any) {
    const profile = await this.prisma.codingProfile.findUnique({
      where: { id },
    });
    if (!profile) throw new NotFoundException('Coding profile not found');
    if (profile.userId !== userId)
      throw new ForbiddenException('You are not allowed to update this profile');

    return this.prisma.codingProfile.update({
      where: { id },
      data: {
        platform: data.platform ?? profile.platform,
        username: data.username ?? profile.username,
        profileUrl: data.profileUrl ?? profile.profileUrl,
      },
    });
  }

  async remove(id: number, userId: number) {
    const profile = await this.prisma.codingProfile.findUnique({
      where: { id },
    });
    if (!profile) throw new NotFoundException('Coding profile not found');
    if (profile.userId !== userId)
      throw new ForbiddenException('You are not allowed to delete this profile');

    await this.prisma.codingProfile.delete({ where: { id } });
    return true;
  }
}
