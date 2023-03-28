import { AxiosError, AxiosResponse } from "axios";
import { UseMutateFunction } from "react-query";

export interface ICheckList {
  completed: boolean;
  task: string;
}
export interface IWorkOrders {
  assetId: number;
  assignedUserIds: [];
  checklist: ICheckList[];
  description: string;
  id: number;
  priority: string;
  status: string;
  title: string;
}

export interface WorkOrder {
  assetId: number;
  assignedUserIds: [];
  checklist: ICheckList[];
  description: string;
  priority: string;
  status: string;
  title: string;
}

export interface GetWorkOrder {
  id?: number;
  signal: AbortSignal | undefined;
}

export interface CreateWorkOrder {
  body: WorkOrder;
}

export interface DeleteWorkOrder {
  id: number;
}

export interface UpdateWorkOrder {
  body: WorkOrder;
  id: number;
}

export interface IWorkOrdersContext {
  data: AxiosResponse<IWorkOrders[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  newWorkOrderData: IWorkOrders[] | undefined;
  setData: (data: IWorkOrders[]) => void;
}

export interface WorkOrderModal {
  selectedItem: IWorkOrders | null;
  addWorkOrder: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    CreateWorkOrder,
    unknown
  >;
  updateWorkOrder: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    UpdateWorkOrder,
    unknown
  >;
  setIsModalVisible: (prevState: boolean) => void;
  onCancel: () => void;
  isModalVisible: boolean;
}
