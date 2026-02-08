import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "../categories/entities/category.entity";

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}
@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: false})
    isCompleted: boolean;

    @ManyToOne(() => Category, (category) => category.tasks)
    category: Category;

    @Column({ type: 'datetime', nullable: true})
    dueDate: Date;

    @Column({ enum: Priority, default: Priority.MEDIUM})
    priority: Priority;
}