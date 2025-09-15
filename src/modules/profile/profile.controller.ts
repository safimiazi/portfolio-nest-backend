import {
    Controller,
    Get,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    NotFoundException,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { successResponse } from 'src/common/response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    // ✅ Public: get profile by id
    @Get('get-my-profile/:id')
    async getProfile(@Param('id') id?: string) {
        const data = await this.profileService.getProfile(Number(id));
        return successResponse(data, 'Profile data fetched.');
    }


    // ✅ Protected: update profile (with avatar upload)
    @UseGuards(JwtAuthGuard)
    @Put('update')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateProfile(
        @Req() req: any,
        @Body() body: any,
        @UploadedFile() avatar?: Express.Multer.File,
    ) {
        const userId = req.user.userId;
        const data = await this.profileService.updateProfile(userId, body, avatar);
        return successResponse(data, 'Profile updated successfully.');
    }

    // ✅ Protected: delete profile
    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    async deleteProfile(@Req() req: any) {
        const userId = req.user.userId;
        await this.profileService.deleteProfile(userId);
        return successResponse(null, 'Profile deleted successfully.');
    }
}
