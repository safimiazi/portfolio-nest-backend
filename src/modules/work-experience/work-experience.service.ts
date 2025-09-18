import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkExperienceService {
    constructor(private prisma: PrismaService) { }

    async create(userId: number, data: any) {
        console.log("data", data)
        // Validate and parse input
        if (!data.role || !data.company || !data.startDate) {
            throw new BadRequestException('Role, company, and startDate are required');
        }

        // Handle achievements field
        let achievements: string[] = [];
        if (data.achievements) {
            if (Array.isArray(data.achievements)) {
                achievements = data.achievements;
            } else if (typeof data.achievements === 'string') {
                try {
                    const parsed = JSON.parse(data.achievements);
                    achievements = Array.isArray(parsed) ? parsed : [data.achievements];
                } catch (e) {
                    // If JSON parsing fails, treat the string as a single achievement
                    achievements = [data.achievements];
                }
            }
        }
        return this.prisma.workExperience.create({
            data: {
                userId,
                role: data.role,
                company: data.company,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                isCurrent: data.isCurrent === true,
                responsibilities: data.responsibilities,
                achievements,
            },
        });
    }

    async findAll(page: number, limit: number, search?: string, order: 'asc' | 'desc' = 'desc') {
        const where: any = search
            ? { role: { contains: search, mode: 'insensitive' } }
            : {};
        const [items, total] = await this.prisma.$transaction([
            this.prisma.workExperience.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: order },
            }),
            this.prisma.workExperience.count({ where }),
        ]);
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: number) {
        const experience = await this.prisma.workExperience.findUnique({ where: { id } });
        if (!experience) throw new NotFoundException('Work experience not found');
        return experience;
    }

    async update(id: number, userId: number, data: any) {
                console.log("data", data)

        const experience = await this.prisma.workExperience.findUnique({ where: { id } });
        if (!experience) throw new NotFoundException('Work experience not found');
        if (experience.userId !== userId) throw new ForbiddenException('You are not allowed to update this work experience');
        // Validate and parse input
        if (!data.role || !data.company || !data.startDate) {
            throw new BadRequestException('Role, company, and startDate are required');
        }

        // Handle achievements field
        let achievements: string[] = [];
        if (data.achievements) {
            if (Array.isArray(data.achievements)) {
                achievements = data.achievements;
            } else if (typeof data.achievements === 'string') {
                try {
                    const parsed = JSON.parse(data.achievements);
                    achievements = Array.isArray(parsed) ? parsed : [data.achievements];
                } catch (e) {
                    // If JSON parsing fails, treat the string as a single achievement
                    achievements = [data.achievements];
                }
            }
        }
        return this.prisma.workExperience.update({
            where: { id },
            data: {
                role: data.role ?? experience.role,
                company: data.company ?? experience.company,
                startDate: data.startDate ? new Date(data.startDate) : experience.startDate,
                endDate: data.endDate ? new Date(data.endDate) : experience.endDate,
                isCurrent: data.isCurrent !== undefined ? data.isCurrent === true : experience.isCurrent,
                responsibilities: data.responsibilities ?? experience.responsibilities,
                achievements: achievements || experience.achievements,
            },
        });
    }

    async remove(id: number, userId: number) {
        const experience = await this.prisma.workExperience.findUnique({ where: { id } });
        if (!experience) throw new NotFoundException('Work experience not found');
        if (experience.userId !== userId) throw new ForbiddenException('You are not allowed to delete this work experience');
        await this.prisma.workExperience.delete({ where: { id } });
        return true;
    }
}