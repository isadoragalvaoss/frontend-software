import { AxiosError, AxiosResponse } from "axios";
import { createContext, useContext } from "react";

interface IUnits {
  companyId: number;
  id: number;
  name: string;
}

interface IUnitsContext {
  data: AxiosResponse<IUnits[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

export const UnitsContext = createContext<IUnitsContext | undefined>(undefined);

export const useUnitsContext = (): IUnitsContext => {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error(
      "useDataContext deve ser usado dentro do provedor de contexto"
    );
  }
  return context;
};

export default UnitsContext;
