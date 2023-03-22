import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { getAssets } from "../../api/services";
import AssetsContext from "../../contexts/AssetsContext";

interface IAsset {
  assignedUserIds: [];
  companyId: number;
  healthHistory: [
    {
      status: string;
      timestamp: string;
    }
  ];
  healthscore: number;
  id: number;
  image: string;
  metrics: {
    lastUptimeAt: string;
    totalCollectsUptime: number;
    totalUptime: number;
  };
  model: string;
  name: string;
  sensors: [];
  specifications: {
    maxTemp: number;
  };
  status: string;
  unitId: number;
}

export const AssetsProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<IAsset[]>,
    AxiosError
  >("assets", ({ signal }) => getAssets({ signal }));

  const contextValue = {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  };

  return (
    <AssetsContext.Provider value={contextValue}>
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;
