import { createContext, useContext } from "react";
import { IAssetsContext } from "../../models/assets";

export const AssetsContext = createContext<IAssetsContext | undefined>(
  undefined
);

export const useAssetsContext = (): IAssetsContext => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error(
      "useDataContext deve ser usado dentro do provedor de contexto"
    );
  }
  return context;
};

export default { AssetsContext, useAssetsContext };
