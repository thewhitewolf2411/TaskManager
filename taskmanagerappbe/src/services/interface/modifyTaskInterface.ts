export interface ModifyTaskInterface {
  title?: string;
  description?: string;
  categoryId?: "Work" | "Personal" | "Learning";
  priority?: "Low" | "Medium" | "High";
  status?: string;
}
