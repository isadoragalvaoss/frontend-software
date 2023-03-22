import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { getWorkOrders } from "../../api/services";
import WorkOrdersContext from "../../contexts/WorkOrdersContext";

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

export const WorkOrdersProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<IWorkOrders[]>,
    AxiosError
  >("WorkOrders", ({ signal }) => getWorkOrders({ signal }));

  const contextValue = {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  };

  return (
    <WorkOrdersContext.Provider value={contextValue}>
      {children}
    </WorkOrdersContext.Provider>
  );
};

export default WorkOrdersProvider;
