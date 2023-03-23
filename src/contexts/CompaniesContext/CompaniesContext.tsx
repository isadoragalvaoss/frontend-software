import { createContext, useContext } from "react";
import { ICompaniesContext } from "../../models/companies";

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

export default { CompaniesContext, useCompaniesContext };
