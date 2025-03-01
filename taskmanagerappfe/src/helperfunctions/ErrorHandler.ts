import { ErrorInterface } from "../interface/ErrorInterface";
import axios from "axios";

export const ErrorHandler = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    
    return error.response?.data?.error || "An error occurred while communicating with the server.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
};