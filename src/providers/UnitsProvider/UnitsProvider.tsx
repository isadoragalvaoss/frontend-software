import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { getUnits } from "../../api/services/units";
import { UnitsContext } from "../../contexts/UnitsContext";
import { IUnits } from "../../models/units";

export const UnitsProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<IUnits[]>,
    AxiosError
  >("units", ({ signal }) => getUnits({ signal }));

  const contextValue = {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  };

  return (
    <UnitsContext.Provider value={contextValue}>
      {children}
    </UnitsContext.Provider>
  );
};

export default UnitsProvider;
