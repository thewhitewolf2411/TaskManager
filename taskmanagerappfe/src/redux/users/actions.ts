import { createAsyncThunk } from "@reduxjs/toolkit"
import { deleteUserApi, getUsersApi, getUser, updateUserApi, getUserByIdApi } from "../../api/User"
import { fetchUsersSuccess, fetchUsersFailure } from "./reducer";

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async ({pageNumber, numberOfResults}:{pageNumber: number, numberOfResults: number}, { dispatch, rejectWithValue }) => {
    try {
      const [, response] = await getUsersApi(pageNumber, numberOfResults);
      dispatch(fetchUsersSuccess(response.users))
      return response; 
    } catch (error: any) {
      dispatch(fetchUsersFailure(error?.response?.data))
      return rejectWithValue(error?.response?.data || "Failed to fetch users");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, ...updatedData }: any, { rejectWithValue }) => {
    try {
      const [error, data] = await updateUserApi(userId, updatedData);
      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({userId, pageNumber, numberOfResults}:{userId: string, pageNumber: number, numberOfResults: number}, { dispatch, rejectWithValue }) => {
    try {
      await deleteUserApi(userId);

      // Fetch updated users list after deleting
      const [, response] = await getUsersApi(pageNumber, numberOfResults);
      dispatch(fetchUsersSuccess(response.users))
      return response
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to delete user");
    }
  }
);

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const [error, data] = await getUserByIdApi(userId);
      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user");
    }
  }
);