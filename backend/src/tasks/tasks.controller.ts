import { Controller, Delete, Get, Post, Patch, Body, Param} from '@nestjs/common';
import { TasksService } from './tasks.service';
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
    createTask(@Body('title') title: string){
        return this.taskService.create(title);
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
