import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @IsOptional()
  @IsUrl()
  linkedinLink?: string;

  @IsOptional()
  @IsUrl()
  twitterLink?: string;

  @IsOptional()
  @IsUrl()
  websiteLink?: string;

  @IsOptional()
  @IsUrl()
  resumeLink?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  universityStart?: string;

  @IsOptional()
  @IsString()
  universityEnd?: string;

  @IsOptional()
  @IsString()
  gpa?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  experience?: string;
}
