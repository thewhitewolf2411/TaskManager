import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskInterface } from "../../interface/TaskInterface";

interface UpdateCommentPayload {
  taskId: string;
  comment?: any; 
  commentId?: string;
  remove?: boolean; 
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [] as TaskInterface[],
  },
  reducers: {
    fetchTasksSuccess: (state, action: PayloadAction<TaskInterface[]>) => {
      state.tasks = action.payload;
    },
    updateTaskComments: (state, action: PayloadAction<UpdateCommentPayload>) => {
      const { taskId, comment, commentId, remove } = action.payload;

      state.tasks = state.tasks.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          comments: remove && commentId
            ? task.comments.filter((c) => c.id !== commentId)
            : comment
            ? [...task.comments, comment]
            : task.comments,
        };
      });
    }
  },
});

export const { fetchTasksSuccess, updateTaskComments } = tasksSlice.actions;
export default tasksSlice.reducer;
