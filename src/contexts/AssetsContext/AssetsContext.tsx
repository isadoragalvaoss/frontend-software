import { AxiosError, AxiosResponse } from "axios";
import { createContext, useContext } from "react";

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

interface IAssetsContext {
  data: AxiosResponse<IAsset[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

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

export default AssetsContext;
