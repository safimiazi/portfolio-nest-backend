import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService, private cloudinary: CloudinaryService,
    ) { }
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

    // Get single profile (public)
    async getProfile(id?: number) {
        const result = await this.prisma.user.findUnique({
            where: { id: id || 1 },
        });

        if (!result) throw new NotFoundException('Profile not found');

        const { password, otp, ...profile } = result; // Remove sensitive fields
        return profile;
    }

    // Update profile
    async updateProfile(
        id: number,
        data: any,
        file?: Express.Multer.File,
    ) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('Profile not found');

        let avatarUrl = user.photo;
        if (file) {
            avatarUrl = await this.uploadAvatar(file);
        }

        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                photo: avatarUrl,
            },
        });

        const { password, otp, ...profile } = updated;
        return profile;
    }
    // Delete profile (only owner)
    async deleteProfile(id: number) {
        // 1. Delete related projects
        await this.prisma.project.deleteMany({ where: { userId: id } });
        await this.prisma.user.delete({ where: { id } });
        return true;
    }

    // List all profiles (admin use)
    async findAllProfiles() {
        const profiles = await this.prisma.user.findMany();
        return profiles.map(({ password, otp, ...p }) => p);
    }

    // Create profile (if needed)
    async createProfile(data: any) {
        const created = await this.prisma.user.create({ data });
        const { password, otp, ...profile } = created;
        return profile;
    }
}
