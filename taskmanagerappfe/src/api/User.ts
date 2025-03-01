import { ErrorHandler } from "../helperfunctions/ErrorHandler";
import Api from "./";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!).token : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUser = async (userId: string) => {
  try {
    const { data } = await Api.post("/auth/login", { userId }, {
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null]
  }
};

export const updateUserApi = async (userId: string, updatedData: any) => {
  try {
    const { data } = await Api.put(`/admin/user/${userId}`, updatedData, {
      headers: getAuthHeaders(),
    });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null];
  }
};


export const getUsersApi = async (pageNumber: number, numberOfResults: number) => {
  try {
    const { data } = await Api.get(`/admin/users?page=${pageNumber}&limit=${numberOfResults}`, {
      headers: getAuthHeaders()
    });
    return [null, data]
  } catch (error: any) {
    return [ErrorHandler(error), null];
  }
};

export const deleteUserApi = async (userId: string) => {
  try {
    const { data } = await Api.delete(`/admin/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return [null, data]
  } catch (error: any) {
    return [ErrorHandler(error), null];
  }
};

export const getUserByIdApi = async (userId: string) => {
  try {
    const { data } = await Api.get(`/admin/user/${userId}`, {
      headers: getAuthHeaders()
    });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null]
  }
};