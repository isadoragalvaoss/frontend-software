import { AxiosError, AxiosResponse } from "axios";

export interface ICompanies {
  id: number;
  name: string;
}

export interface Company {
  name: string;
}

export interface GetCompany {
  id?: number;
  signal: AbortSignal | undefined;
}

export interface CreateCompany {
  body: Company;
}

export interface DeleteCompany {
  id: number;
}

export interface UpdateCompany {
  body: Company;
  id: number;
}

export interface ICompaniesContext {
  data: AxiosResponse<ICompanies[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}
