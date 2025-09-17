import { Module } from '@nestjs/common';
import { LearningGoalController } from './learning-goal.controller';
import { LearningGoalService } from './learning-goal.service';

@Module({
  controllers: [LearningGoalController],
  providers: [LearningGoalService]
})
export class LearningGoalModule {}
