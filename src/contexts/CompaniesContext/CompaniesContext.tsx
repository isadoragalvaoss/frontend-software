import { AxiosError, AxiosResponse } from "axios";
import { createContext, useContext } from "react";

interface ICompanies {
  id: number;
  name: string;
}

interface ICompaniesContext {
  data: AxiosResponse<ICompanies[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

export const CompaniesContext = createContext<ICompaniesContext | undefined>(
  undefined
);

export const useCompaniesContext = (): ICompaniesContext => {
  const context = useContext(CompaniesContext);
  if (!context) {
    throw new Error(
      "useDataContext deve ser usado dentro do provedor de contexto"
    );
  }
  return context;
};

export default CompaniesContext;
