import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';


@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private repo: Repository<Task>){   }

    async findAll(): Promise<Task[]>{
        return this.repo.find();
    }

    async create(title: string): Promise<Task>{
        const newTask = this.repo.create({title});
        return this.repo.save(newTask);
    }
}
