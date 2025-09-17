import { Module } from '@nestjs/common';



import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SkillModule } from './modules/skill/skill.module';
import { WorkExperienceModule } from './modules/work-experience/work-experience.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { LearningGoalModule } from './modules/learning-goal/learning-goal.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // 👈 makes ConfigService available everywhere
  }), AuthModule, ProjectsModule, ProfileModule, SkillModule, WorkExperienceModule, TestimonialModule, LearningGoalModule, ],
  controllers: [],
  providers: [],
})
export class AppModule { }
