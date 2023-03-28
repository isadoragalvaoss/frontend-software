import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { getAssets } from "../../api/services/assets";
import { AssetsContext } from "../../contexts/AssetsContext";
import { IAssets } from "../../models/assets";

export const AssetsProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<IAssets[]>,
    AxiosError
  >("assets", ({ signal }) => getAssets({ signal }));

  const [newAssetData, setNewAssetData] = useState<IAssets[]>([]);
  const handleSetData = (newData: IAssets[]) => {
    setNewAssetData(newData);
  };

  const contextValue = {
    data,
    setData: handleSetData,
    newAssetData: newAssetData,
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
