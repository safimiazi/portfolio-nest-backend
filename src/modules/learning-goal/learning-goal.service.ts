import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LearningGoalService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, data: any) {
        // Validate required fields
        if (!data.category || !data.title) {
            throw new BadRequestException('Category and title are required');
        }

        // Handle tags field
        let tags: string[] = [];
        if (data.tags) {
            if (Array.isArray(data.tags)) {
                tags = data.tags;
            } else if (typeof data.tags === 'string') {
                try {
                    const parsed = JSON.parse(data.tags);
                    tags = Array.isArray(parsed) ? parsed : data.tags.split(',').map((tag) => tag.trim());
                } catch (e) {
                    // If JSON parsing fails, split by comma and trim
                    tags = data.tags.split(',').map((tag) => tag.trim());
                }
            }
        }
        return this.prisma.learningGoal.create({
            data: {
                userId,
                category: data.category,
                title: data.title,
                description: data.description,
                tags
            },
        });
    }

    async findAll(page: number, limit: number, search?: string, order: 'asc' | 'desc' = 'desc') {
        const where: any = search
            ? { title: { contains: search, mode: 'insensitive' } }
            : {};
        const [items, total] = await this.prisma.$transaction([
            this.prisma.learningGoal.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: order },
            }),
            this.prisma.learningGoal.count({ where }),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: number) {
        const goal = await this.prisma.learningGoal.findUnique({ where: { id } });
        if (!goal) throw new NotFoundException('Learning goal not found');
        return goal;
    }

    async update(id: number, userId: number, data: any) {
        const goal = await this.prisma.learningGoal.findUnique({ where: { id } });
        if (!goal) throw new NotFoundException('Learning goal not found');
        if (goal.userId !== userId) throw new ForbiddenException('You are not allowed to update this learning goal');

        return this.prisma.learningGoal.update({
            where: { id },
            data: {
                category: data.category ?? goal.category,
                title: data.title ?? goal.title,
                description: data.description ?? goal.description,
                tags: data.tags ? JSON.parse(data.tags) : goal.tags,
            },
        });
    }

    async remove(id: number, userId: number) {
        const goal = await this.prisma.learningGoal.findUnique({ where: { id } });
        if (!goal) throw new NotFoundException('Learning goal not found');
        if (goal.userId !== userId) throw new ForbiddenException('You are not allowed to delete this learning goal');
        await this.prisma.learningGoal.delete({ where: { id } });
        return true;
    }
}