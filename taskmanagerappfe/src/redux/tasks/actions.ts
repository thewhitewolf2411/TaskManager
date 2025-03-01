import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getTasksApi, createTaskApi, updateTaskStatusApi, deleteTaskApi, 
  addCommentApi, deleteCommentApi, editCommentApi, updateTaskApi 
} from "../../api/Task";
import { fetchTasksSuccess, updateTaskComments } from "./reducer";
import { showAlert } from "../common/actions";

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (
    { priorityFilter = null, dueDateFilter = null }: { priorityFilter?: string | null; dueDateFilter?: string | null },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const [error, data] = await getTasksApi(priorityFilter, dueDateFilter);
      if (error) throw error;
      dispatch(fetchTasksSuccess(data.tasks));
      return data.tasks; 
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to fetch tasks", type: "error" }));
      return rejectWithValue(error?.message || "Failed to fetch tasks");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({ title, description, priority, status, categoryId, dueDate }: any, { dispatch, rejectWithValue }) => {
    try {
      const [error, data] = await createTaskApi({ title, description, priority, status, categoryId, dueDate });
      if (error) throw error;
      dispatch(getTasks({}));
      dispatch(showAlert({ message: "Task created successfully", type: "success" }));
      return data;
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to create task", type: "error" }));
      return rejectWithValue(error?.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, title, description, priority, status, categoryId, dueDate }: any, { dispatch, rejectWithValue }) => {
    try {
      const [error, data] = await updateTaskApi({ id, title, description, priority, status, categoryId, dueDate });
      if (error) throw error;
      dispatch(getTasks({})); 
      dispatch(showAlert({ message: "Task updated successfully", type: "success" }));
      return data;
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to update task", type: "error" }));
      return rejectWithValue(error?.message || "Failed to update task");
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ taskId, status }: { taskId: string; status: string }, { dispatch, rejectWithValue }) => {
    try {
      const [error, data] = await updateTaskStatusApi(taskId, status);
      if (error) throw error;
      dispatch(getTasks({}));
      dispatch(showAlert({ message: "Task status updated successfully", type: "success" }));
      return data;
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to update task status", type: "error" }));
      return rejectWithValue(error?.message || "Failed to update task status");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { dispatch, rejectWithValue }) => {
    try {
      const [error] = await deleteTaskApi(taskId);
      if (error) throw error;
      dispatch(getTasks({})); // Refresh task list after deletion
      dispatch(showAlert({ message: "Task deleted successfully", type: "success" }));
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to delete task", type: "error" }));
      return rejectWithValue(error?.message || "Failed to delete task");
    }
  }
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, comment }: { taskId: string; comment: string }, { dispatch, rejectWithValue }) => {
    try {
      const [error, newComment] = await addCommentApi(taskId, comment);
      if (error) throw error;
      dispatch(updateTaskComments({ taskId, comment: newComment }));
      dispatch(showAlert({ message: "Comment added successfully", type: "success" }));
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to add comment", type: "error" }));
      return rejectWithValue(error?.message || "Failed to add comment");
    }
  }
);

export const editComment = createAsyncThunk(
  "tasks/editComment",
  async ({ commentId, comment }: { commentId: string; comment: string }, { dispatch, rejectWithValue }) => {
    try {
      const [error] = await editCommentApi(commentId, comment);
      if (error) throw error;
      dispatch(getTasks({})); // Refresh comments after editing
      dispatch(showAlert({ message: "Comment edited successfully", type: "success" }));
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to edit comment", type: "error" }));
      return rejectWithValue(error?.message || "Failed to edit comment");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "tasks/deleteComment",
  async (commentId: string, { dispatch, rejectWithValue }) => {
    try {
      const [error] = await deleteCommentApi(commentId);
      if (error) throw error;
      dispatch(getTasks({})); // Refresh tasks
      dispatch(showAlert({ message: "Comment deleted successfully", type: "success" }));
    } catch (error: any) {
      dispatch(showAlert({ message: error?.message || "Failed to delete comment", type: "error" }));
      return rejectWithValue(error?.message || "Failed to delete comment");
    }
  }
);
