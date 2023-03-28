import { AxiosError, AxiosResponse } from "axios";
import { UseMutateFunction } from "react-query";

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
  newCompanyData: ICompanies[] | undefined;
  setData: (data: ICompanies[]) => void;
}

export interface CompanyModal {
  selectedItem: ICompanies | null;
  addCompany: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    CreateCompany,
    unknown
  >;
  updateCompany: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    UpdateCompany,
    unknown
  >;
  setIsModalVisible: (prevState: boolean) => void;
  onCancel: () => void;
  isModalVisible: boolean;
}
