import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Task } from "src/tasks/task.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Task, (task) => task.category)
    tasks: Task[]
}
