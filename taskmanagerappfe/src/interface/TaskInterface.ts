import { CommentInterface } from "./CommentInterface";

export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  priority: string;
  categoryId: number;
  status: "todo" | "inProgress" | "completed";
  comments: CommentInterface[];
  dueDate?: Date
}
