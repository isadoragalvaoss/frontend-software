import { AxiosError, AxiosResponse } from "axios";
import { createContext, useContext } from "react";

interface IUser {
  companyId: number;
  email: string;
  id: number;
  name: string;
  unitId: number;
}

interface IUserContext {
  data: AxiosResponse<IUser[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export const useUserContext = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useDataContext deve ser usado dentro do provedor de contexto"
    );
  }
  return context;
};

export default UserContext;
