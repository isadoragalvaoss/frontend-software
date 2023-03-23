import { createContext, useContext } from "react";
import { IWorkOrdersContext } from "../../models/workorders";

export const WorkOrdersContext = createContext<IWorkOrdersContext | undefined>(
  undefined
);

export const useWorkOrdersContext = (): IWorkOrdersContext => {
  const context = useContext(WorkOrdersContext);
  if (!context) {
    throw new Error(
      "useDataContext deve ser usado dentro do provedor de contexto"
    );
  }
  return context;
};

export default { WorkOrdersContext, useWorkOrdersContext };
