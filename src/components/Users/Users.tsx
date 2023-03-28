import { Button, Card, List, Popconfirm, Skeleton, Typography } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUser, deleteUser, updateUser } from "../../api/services/users";
import { useUserContext } from "../../contexts/UserContext";
import { CreateUser, DeleteUser, IUsers, UpdateUser } from "../../models/users";
import FormModal from "../Modal/FormModal/FormUserModal";
import { CardTitle } from "./Users.styles";
const { Title } = Typography;

const Users = (): JSX.Element => {
  const {
    data: dataUser,
    error,
    isLoading,
    isError,
    isFetching,
    newUserData,
    setData,
  } = useUserContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<IUsers | null>(null);

  const itemsPerPage = 4;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const hasNewUserData = newUserData && newUserData.length > 0;
  const paginationTotal = hasNewUserData
    ? newUserData.length
    : dataUser?.data.length;

  const dataList = hasNewUserData
    ? newUserData.slice(start, end)
    : dataUser?.data.slice(start, end);
  const pagination = {
    current: currentPage,
    pageSize: itemsPerPage,
    total: paginationTotal,
    onChange: (page: number) => setCurrentPage(page),
  };

  function removeItemById(arr: IUsers[], variables: DeleteUser): IUsers[] {
    return arr.filter((item) => item.id !== variables.id);
  }

  function updateItemById(arr: IUsers[], item: IUsers): IUsers[] {
    const index = arr.findIndex((currentItem) => currentItem.id === item.id);
    if (index !== -1) {
      const newArray = [...arr];
      newArray[index] = item;
      return newArray;
    }
    return arr;
  }

  const { mutate: mutateAddUser } = useMutation(
    ({ body }: CreateUser) => addUser({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewUserData) setData([...(dataUser?.data ?? []), data.data]);
        else {
          const newId = Math.max(...newUserData.map((item) => item.id)) + 1;
          const newItem = { ...data.data, id: newId };
          setData([...newUserData, newItem]);
        }
        toast.success("User added!");
      },
    }
  );

  const { mutate: mutateUpdateUser } = useMutation(
    ({ body, id }: UpdateUser) => updateUser({ body, id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewUserData && dataUser) {
          const newData = updateItemById(dataUser?.data, data.data);
          setData(newData);
        } else {
          if (newUserData) {
            const newData = updateItemById(newUserData, data.data);
            setData(newData);
          }
        }
        toast.success("User updated!");
      },
      onError: (error: AxiosError, variables) => {
        const data: IUsers = {
          name: variables.body.name,
          id: variables.id,
          companyId: variables.body.companyId,
          email: variables.body.email,
          unitId: variables.body.unitId,
        };
        if (newUserData) {
          setData(updateItemById(newUserData, data));
          toast.success("User updated!");
        } else toast.error(`${error.message}`);
      },
    }
  );

  const { mutate: mutateRemoveUser } = useMutation(
    ({ id }: DeleteUser) => deleteUser({ id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewUserData && dataUser)
          setData(removeItemById(dataUser?.data, variables));
        else {
          if (newUserData) {
            setData(removeItemById(newUserData, variables));
          }
        }
        toast.success("User deleted!");
      },
      onError: (error: AxiosError, variables) => {
        if (newUserData) {
          setData(removeItemById(newUserData, variables));
          if (currentPage > 1) setCurrentPage(currentPage - 1);
          toast.success("User deleted!");
        } else toast.error(`${error.message}`);
      },
    }
  );

  const showModal = (item: IUsers | null) => {
    setSelectedItem(item ?? null);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const confirm = (item: IUsers) => {
    mutateRemoveUser({ id: item.id });
  };

  function renderUsers() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataUser) {
      return <Skeleton title={false} loading={isLoading} active></Skeleton>;
    } else {
      return (
        <Card
          title={
            <CardTitle>
              <Title level={3}>Users</Title>
              <Button onClick={() => showModal(null)}>New User</Button>
            </CardTitle>
          }
        >
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={dataList}
            pagination={pagination}
            style={{ overflow: "auto" }}
            renderItem={(item: IUsers) => (
              <List.Item
                actions={[
                  <Button onClick={() => showModal(item)}>Edit</Button>,
                  <Popconfirm
                    title="Delete the user"
                    description="Are you sure to delete this user?"
                    onConfirm={() => confirm(item)}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                  >
                    <Button>Delete</Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta title={item.name} description={item.email} />
              </List.Item>
            )}
          />
        </Card>
      );
    }
  }

  return (
    <div>
      {renderUsers()}
      <FormModal
        addUser={mutateAddUser}
        updateUser={mutateUpdateUser}
        isModalVisible={isModalVisible}
        selectedItem={selectedItem}
        setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
        onCancel={hideModal}
      />
      <ToastContainer />
    </div>
  );
};

export default Users;
