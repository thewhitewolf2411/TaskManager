import { RootState } from "../store";
import { TaskInterface } from "../../interface/TaskInterface";

export const selectTasks = (state: RootState): TaskInterface[] => state.tasks.tasks;
