import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';


@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private repo: Repository<Task>){   }

    async findAll(): Promise<Task[]>{
        return this.repo.find({ relations: ['category']});
    }

    async create(title: string, categoryId: number, dueDate?: string): Promise<Task>{
        const newTask = this.repo.create({title, 
                                          category: { id: categoryId},
                                          dueDate: dueDate ? new Date(dueDate) : undefined});
        return this.repo.save(newTask);
    }

    async findOne(id: number){
        if(!id){
            return null;
        }

        return this.repo.findOneBy({id});
    }

    async remove(id: number): Promise<Task> {
        const task = await this.findOne(id);

        if(!task){
            throw new NotFoundException('Task not found');
        }

        return this.repo.remove(task);
    }

    async edit(id: number): Promise<Task> {
        const task = await this.findOne(id);
        if(!task){
            throw new NotFoundException('Task not found');
        }

        task.isCompleted = !task.isCompleted;

        return this.repo.save(task);
    }
}
