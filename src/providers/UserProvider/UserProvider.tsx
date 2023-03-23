import { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { getUsers } from "../../api/services/users";
import UserContext from "../../contexts/UserContext";
import { IUsers } from "../../models/users";

export const UserProvider = ({ children }: any): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useQuery<
    AxiosResponse<IUsers[]>,
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
