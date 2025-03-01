import { createAction } from "@reduxjs/toolkit";

// Define alert actions
export const showAlert = createAction<{ message: string; type: "success" | "error" | "info" }>(
  "common/showAlert"
);
export const hideAlert = createAction("common/hideAlert");
