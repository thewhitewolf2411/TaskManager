import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserInterface } from "../../interface/UserInterface";

interface UsersState {
  loading: boolean;
  error: string;
  users: UserInterface[];
}

const initialState: UsersState = {
  loading: false,
  error: "",
  users: [],
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUsersRequest: (state) => {
      state.loading = true;
      state.error = "";
    },
    fetchUsersSuccess: (state, action: PayloadAction<UserInterface[]>) => {
      state.loading = false;
      state.users = action.payload;
      state.error = "";
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const selectLoading = (state: RootState) => state.users.loading;
export const selectError = (state: RootState) => state.users.error;
export const selectUsers = (state: RootState) => state.users.users;

export const { fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure } = usersSlice.actions;
export default usersSlice.reducer;
