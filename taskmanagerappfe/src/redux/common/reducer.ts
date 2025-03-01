import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
  loading: boolean;
  alert: {
    type: string;
    message: string;
    duration: number;
    show: boolean;
  } | null;
}

const getAlertType = (type: string) => {
  switch (type) {
    case "error":
    case "warning":
    case "info":
      return type;
    default:
      return "success";
  }
};

const initialState: CommonState = {
  loading: true,
  alert: null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<{ type: string; message: string; duration?: number }>) => {
      state.alert = {
        type: getAlertType(action.payload.type),
        message: action.payload.message,
        duration: action.payload.duration || 30000,
        show: true,
      };
    },
    hideAlert: (state, action: PayloadAction<{ type: string }>) => {
      if (state.alert) {
        state.alert.show = false;
      }
    },
  },
});

export const { showAlert, hideAlert } = commonSlice.actions; 
export default commonSlice.reducer; 
