import { createSelector } from "@reduxjs/toolkit";

const selectUsersState = (state: any) => state.users;

const selectUserById = (state: any, userId: string) =>
    state.users.users.find((user: any) => user.id === userId)

export { selectUsersState, selectUserById };
