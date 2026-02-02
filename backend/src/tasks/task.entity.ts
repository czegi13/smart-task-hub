import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "src/categories/entities/category.entity";
@Entity()
export class Task{

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

}