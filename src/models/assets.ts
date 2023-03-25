import { AxiosError, AxiosResponse } from "axios";
import { UseMutateFunction } from "react-query";

export interface HealthHistory {
  status: string;
  timestamp: string;
}

export interface IAssets {
  assignedUserIds: [];
  companyId: number;
  healthHistory: HealthHistory[];
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
    power?: number;
    rpm?: number;
  };
  status: string;
  unitId: number;
}

export interface Asset {
  assignedUserIds: [];
  companyId: number;
  healthHistory: HealthHistory[];
  healthscore: number;
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
    power?: number;
    rpm?: number;
  };
  status: string;
  unitId: number;
}

export interface GetAsset {
  id?: number;
  signal: AbortSignal | undefined;
}

export interface CreateAsset {
  body: Asset;
}

export interface DeleteAsset {
  id: number;
}

export interface UpdateAsset {
  body: Asset;
  id: number;
}

export interface IAssetsContext {
  data: AxiosResponse<IAssets[]> | undefined;
  error: AxiosError | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

export interface AssetModal {
  selectedItem: IAssets | null;
  addAsset: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    CreateAsset,
    unknown
  >;
  updateAsset: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    UpdateAsset,
    unknown
  >;
  setIsModalVisible: (prevState: boolean) => void;
  onCancel: () => void;
  isModalVisible: boolean;
}

export interface Specifics {
  specifications: {
    maxTemp: number;
    power?: number | undefined;
    rpm?: number | undefined;
  };
}

export interface Metrics {
  metrics: {
    totalCollectsUptime: number;
    totalUptime: number;
    lastUptimeAt: string;
  };
}
