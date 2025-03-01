import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { LoggedUserInterface } from "../../interface/LoggedUserInterface";

const loadUserFromSession = (): LoggedUserInterface => {
  const storedUser = sessionStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : { loading: false, error: false };
};

const initialState: LoggedUserInterface = loadUserFromSession();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = "";
    },
    loginSuccess: (state, action: PayloadAction<LoggedUserInterface>) => {
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, ...action.payload, loading: false, error: null };
    },
    loginFailure: (state, action: PayloadAction<string> ) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      sessionStorage.removeItem("user");
      return { loading: false, error: null }
    },
    updateUser: (state, action: PayloadAction<Partial<LoggedUserInterface>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const selectLoading = (state: RootState) => state.user.loading
export const selectError = (state: RootState) => state.user.error

export const { loginRequest, loginSuccess, loginFailure, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
