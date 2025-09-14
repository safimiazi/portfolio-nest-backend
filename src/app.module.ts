import { Module } from '@nestjs/common';



import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // 👈 makes ConfigService available everywhere
  }), AuthModule, ProjectsModule, ],
  controllers: [],
  providers: [],
})
export class AppModule { }
