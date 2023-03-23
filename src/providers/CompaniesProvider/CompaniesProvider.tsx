import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { getCompanies } from "../../api/services";
import CompaniesContext from "../../contexts/CompaniesContext";

interface ICompanies {
  id: number;
  name: string;
}

export const CompaniesProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<ICompanies[]>,
    AxiosError
  >("companies", ({ signal }) => getCompanies({ signal }));

  const contextValue = {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  };

  return (
    <CompaniesContext.Provider value={contextValue}>
      {children}
    </CompaniesContext.Provider>
  );
};

export default CompaniesProvider;