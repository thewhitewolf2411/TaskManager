import { ErrorHandler } from "../helperfunctions/ErrorHandler";
import Api from "./";

export const Login = async (email: string, password: string) => {
  try {
    const { data } = await Api.post("/auth/login", { email, password });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null]
  }
};

export const Register = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    const { data } = await Api.post("/auth/register", { firstName, lastName, email, password });
    return [null, data];
  } catch (error: any) {
    return [ErrorHandler(error), null]
  }
};


export const Logout = () => {

}