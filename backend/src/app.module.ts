import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Task } from './tasks/task.entity';
import { TasksModule } from './tasks/tasks.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [Task, Category],
    synchronize: true
  }), TasksModule, TasksModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
