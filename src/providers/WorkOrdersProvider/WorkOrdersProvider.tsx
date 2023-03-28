import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { getWorkOrders } from "../../api/services/workorders";
import { WorkOrdersContext } from "../../contexts/WorkOrdersContext";
import { IWorkOrders } from "../../models/workorders";

export const WorkOrdersProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<IWorkOrders[]>,
    AxiosError
  >("workOrders", ({ signal }) => getWorkOrders({ signal }));

  const [newWorkOrderData, setNewWorkOrderData] = useState<IWorkOrders[]>([]);
  const handleSetData = (newData: IWorkOrders[]) => {
    setNewWorkOrderData(newData);
  };

  const contextValue = {
    data,
    setData: handleSetData,
    newWorkOrderData: newWorkOrderData,
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
