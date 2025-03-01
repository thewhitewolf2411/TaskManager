import { createAsyncThunk } from "@reduxjs/toolkit"

import { getUser } from "../../api/User"

import { showAlert } from "../common/actions"

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getUser(id);
      return response[0].data; 
    } catch (error: any) {
      return rejectWithValue(error?.response?.data || "Failed to fetch user profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ data, shouldShowAlert }: any, thunkApi) => {
    try {
      if (shouldShowAlert) {
        thunkApi.dispatch(showAlert({ message: "", type: "success" }))
      }

      return data
    } catch (e) {
      if (shouldShowAlert) {
        thunkApi.dispatch(
          showAlert({
            type: "error",
            message: "",
          })
        )
      }
    }
  }
)

