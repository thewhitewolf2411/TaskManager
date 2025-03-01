import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/reducer";
import usersReducer from "./users/reducer";
import tasksReducer from "./tasks/reducer";
import commonReducer from "./common/reducer";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    user: userReducer,
    users: usersReducer,
    tasks: tasksReducer
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
        serializableCheck: false,
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;