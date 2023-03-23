import { Button, Card, List, Skeleton, Typography } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { addUser, deleteUser, updateUser } from "../../api/services/users";
import { useUserContext } from "../../contexts/UserContext/UserContext";
import { CreateUser, DeleteUser, IUsers, UpdateUser } from "../../models/users";
import FormModal from "../Modal/FormModal";

const Users = (): JSX.Element => {
  const {
    data: dataUser,
    error,
    isLoading,
    isError,
    isFetching,
  } = useUserContext();
  const [dataTotal, setDataTotal] = useState<IUsers[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const hasDataTotal = dataTotal?.length !== 0;
  const [currentPage, setCurrentPage] = useState(1);

  const { mutate: mutateAddUser } = useMutation(
    ({ body }: CreateUser) => addUser({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasDataTotal) setDataTotal([...(dataUser?.data ?? []), data.data]);
        else setDataTotal([...dataTotal, data.data]);
      },
    }
  );

  const { mutate: mutateUpdateUser } = useMutation(
    ({ body, id }: UpdateUser) => updateUser({ body, id }),
    {
      onSuccess: (data, variables) => {
        function updateItemById(arr: IUsers[], item: IUsers): IUsers[] {
          return arr.map((currentItem) => {
            if (currentItem.id === item.id) {
              return item;
            }
            return currentItem;
          });
        }

        if (!hasDataTotal && dataUser) {
          const newData = updateItemById(dataUser?.data, data.data);
          setDataTotal(newData);
        } else {
          const newData = updateItemById(dataTotal, data.data);
          setDataTotal(newData);
        }
      },
    }
  );

  const { mutate: mutateRemoveUser } = useMutation(
    ({ id }: DeleteUser) => deleteUser({ id }),
    {
      onSuccess: (data, variables) => {
        function removeItemById(arr: IUsers[]): IUsers[] {
          return arr.filter((item) => item.id !== variables.id);
        }

        if (!hasDataTotal && dataUser)
          setDataTotal(removeItemById(dataUser?.data));
        else setDataTotal(removeItemById(dataTotal));
      },
    }
  );

  const itemsPerPage = 4;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const [selectedItem, setSelectedItem] = useState<IUsers | null>(null);

  const { Title } = Typography;
  function renderUsers() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataUser) {
      return <Skeleton title={false} loading={isLoading} active></Skeleton>;
    } else {
      return (
        <div>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Title level={3}>Users</Title>
                <Button
                  onClick={() => {
                    setSelectedItem(null);
                    setIsModalVisible(true);
                  }}
                >
                  New User
                </Button>
              </div>
            }
            style={{ height: "75vh" }}
          >
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={
                hasDataTotal
                  ? dataTotal.slice(start, end)
                  : dataUser?.data.slice(start, end)
              }
              pagination={{
                align: "center",
                position: "bottom",
                current: currentPage,
                pageSize: itemsPerPage,
                total: hasDataTotal ? dataTotal.length : dataUser?.data.length,
                onChange: (page: number) => setCurrentPage(page),
              }}
              renderItem={(item: IUsers) => (
                <List.Item
                  actions={[
                    <Button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalVisible(true);
                      }}
                    >
                      Edit
                    </Button>,
                    <Button onClick={() => mutateRemoveUser({ id: item.id })}>
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta title={item.name} description={item.email} />
                </List.Item>
              )}
            />
          </Card>
        </div>
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
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default Users;
