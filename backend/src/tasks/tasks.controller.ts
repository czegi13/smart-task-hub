import { Controller, Delete, Get, Post, Patch, Body, Param} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { create } from 'domain';
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly taskService: TasksService
    ){}

    @Get()
    getAll(){
        return this.taskService.findAll();
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto){
        return this.taskService.create(createTaskDto.title, createTaskDto.categoryId);
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string){
        return this.taskService.remove(+id);
    }

    @Patch(':id')
    editTask(@Param('id') id: string){
        return this.taskService.edit(+id);
    }

}
