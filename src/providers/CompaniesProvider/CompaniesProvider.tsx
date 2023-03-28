import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { getCompanies } from "../../api/services/companies";
import { CompaniesContext } from "../../contexts/CompaniesContext";
import { ICompanies } from "../../models/companies";

export const CompaniesProvider = ({ children }: any): JSX.Element => {
  const {
    data: companyData,
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery<AxiosResponse<ICompanies[]>, AxiosError>(
    "companies",
    ({ signal }) => getCompanies({ signal })
  );

  const [newCompanyData, setNewCompanyData] = useState<ICompanies[]>([]);
  const handleSetData = (newData: ICompanies[]) => {
    setNewCompanyData(newData);
  };
  const contextValue = {
    data: companyData,
    setData: handleSetData,
    newCompanyData: newCompanyData,
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
