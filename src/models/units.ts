import { AxiosError, AxiosResponse } from "axios";

export interface IUnits {
  companyId: number;
  id: number;
  name: string;
}

export interface Unit {
  companyId: number;
  name: string;
}

export interface GetUnit {
  id?: number;
  signal: AbortSignal | undefined;
}

export interface CreateUnit {
  body: Unit;
}

export interface DeleteUnit {
  id: number;
}

export interface UpdateUnit {
  body: Unit;
  id: number;
}

export interface IUnitsContext {
  data: AxiosResponse<IUnits[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}