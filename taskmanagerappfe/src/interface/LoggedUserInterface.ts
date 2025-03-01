export interface LoggedUserInterface {
  loading: boolean;
  error: string | null;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  role?: string;
}
