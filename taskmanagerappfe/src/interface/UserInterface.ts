export interface UserInterface {
  loading: boolean;
  error: string | null;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}
