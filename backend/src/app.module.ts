import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskModule } from './task/task.module';
import { Task } from './task.entity';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Task],
    synchronize: true
  }), TaskModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
