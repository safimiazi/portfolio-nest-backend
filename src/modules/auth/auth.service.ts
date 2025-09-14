import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../email/email.service';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    async register(dto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existingUser) throw new BadRequestException('Email already registered.');

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: { ...dto, password: hashedPassword },
        });

        const { password, ...result } = user;
        return result;
    }

    async login(dto: LoginUserDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        return this.generateToken(user.id, user.email);
    }

    private generateToken(userId: number, email: string) {
        const payload = { userId, email };
        return { accessToken: this.jwtService.sign(payload) };
    }

    async forgotPassword(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.prisma.user.update({ where: { email }, data: { otp, } });

        await this.mailService.sendPasswordReset(email, otp);

        return { message: 'OTP sent to email' };
    }

    async resetPasswordWithOtp(email: string, otp: string, newPassword: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword, otp: null,  changePasswordAt: new Date() },
        });

        return { message: 'Password reset successful' };
    }
}
