import { AxiosError, AxiosResponse } from "axios";
import { createContext, useContext } from "react";

interface ICheckList {
  completed: boolean;
  task: string;
}
interface IWorkOrders {
  assetId: number;
  assignedUserIds: [];
  checklist: ICheckList[];
  description: string;
  id: 1;
  priority: string;
  status: string;
  title: string;
}

interface IWorkOrdersContext {
  data: AxiosResponse<IWorkOrders[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

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

export default WorkOrdersContext;
