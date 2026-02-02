import { Priority } from "../task.entity";

export class CreateTaskDto {
  title: string;
  categoryId: number;
  dueDate?: string;
  priority: Priority;
}