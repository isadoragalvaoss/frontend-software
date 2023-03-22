import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { getUsers } from "../../api/services";
import UserContext from "../../contexts/UserContext";

interface IUser {
  companyId: number;
  email: string;
  id: number;
  name: string;
  unitId: number;
}

export const UserProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<IUser[]>,
    AxiosError
  >("users", ({ signal }) => getUsers({ signal }));

  const contextValue = {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
