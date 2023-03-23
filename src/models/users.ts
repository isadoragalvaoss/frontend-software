import { AxiosError, AxiosResponse } from "axios";

export interface IUsers {
  companyId: number;
  email: string;
  id: number;
  name: string;
  unitId: number;
}

export interface User {
  companyId: number | null;
  email: string | null;
  name: string;
  unitId: number | null;
}

export interface GetUser {
  id?: number;
  signal: AbortSignal | undefined;
}

export interface CreateUser {
  body: User;
}

export interface DeleteUser {
  id: number;
}

export interface UpdateUser {
  body: User;
  id: number;
}

export interface IUsersContext {
  data: AxiosResponse<IUsers[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}
