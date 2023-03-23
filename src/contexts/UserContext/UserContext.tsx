import { createContext, useContext } from "react";
import { IUsersContext } from "../../models/users";

export const UserContext = createContext<IUsersContext | undefined>(undefined);

export const useUserContext = (): IUsersContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useDataContext deve ser usado dentro do provedor de contexto"
    );
  }
  return context;
};

export default UserContext;
