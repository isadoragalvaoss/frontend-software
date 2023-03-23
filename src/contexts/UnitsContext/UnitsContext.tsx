import { createContext, useContext } from "react";
import { IUnitsContext } from "../../models/units";

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

export default { UnitsContext, useUnitsContext };
