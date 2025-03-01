import Api from "./";
import { ErrorHandler } from "../helperfunctions/ErrorHandler";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!).token : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTasksApi = async (priorityFilter: string | null = null, dueDateFilter: string | null = null) => {
  try {
    const queryParams = new URLSearchParams();
    if (priorityFilter) queryParams.append("priority", priorityFilter);
    if (dueDateFilter) queryParams.append("dueDate", dueDateFilter);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const { data } = await Api.get(`/tasks${queryString}`, {
      headers: getAuthHeaders(),
    });

    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null];
  }
};


export const createTaskApi = async ({ title, description, priority, status, categoryId, dueDate }: any) => {
  try {
    const { data } = await Api.post("/task", { title, description, priority, status, categoryId, dueDate }, {
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null];
  }
};

export const updateTaskApi = async ({ id, title, description, priority, status, categoryId, dueDate }: any) => {
  try {
    const { data } = await Api.put(`/task/${id}`, { title, description, priority, status, categoryId, dueDate }, {
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null];
  }
};

export const updateTaskStatusApi = async (taskId: string, status: string) => {
  try {
    const { data } = await Api.put(`/task/${taskId}/status`, { status }, {
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null];
  }
};

export const deleteTaskApi = async (taskId: string) => {
  try {
    const { data } = await Api.delete(`/task/${taskId}`, {
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [error, null];
  }
};

export const addCommentApi = async (taskId: string, comment: string) => {
  try {
    const { data } = await Api.post(`/task/comment/${taskId}`, {
      comment
    },{
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [error, null];
  }
};

export const editCommentApi = async (taskId: string, comment: string) => {
  try {
    const {data} = await Api.put(`/task/comment/${taskId}`, {
      comment
    },{
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [error, null];
  }
};

export const deleteCommentApi = async (commentId: string) => {
  try {
    const { data } = await Api.delete(`/task/comment/${commentId}`,{
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [error, null];
  }
};