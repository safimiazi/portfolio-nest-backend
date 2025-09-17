import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any) {
    return this.prisma.skill.create({
      data: {
        userId,
        category: data.category,
        name: data.name,
        proficiency: data.proficiency,
      },
    });
  }

  async findAll(page: number, limit: number, search?: string, order: 'asc' | 'desc' = 'desc') {
    const where: any = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.skill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: order },
      }),
      this.prisma.skill.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async update(id: number, userId: number, data: any) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    if (skill.userId !== userId) throw new ForbiddenException('You are not allowed to update this skill');

    return this.prisma.skill.update({
      where: { id },
      data: {
        category: data.category ?? skill.category,
        name: data.name ?? skill.name,
        proficiency: data.proficiency ?? skill.proficiency,
      },
    });
  }

  async remove(id: number, userId: number) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    if (skill.userId !== userId) throw new ForbiddenException('You are not allowed to delete this skill');
    await this.prisma.skill.delete({ where: { id } });
    return true;
  }
}