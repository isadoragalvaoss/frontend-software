import { Button, Card, List, Popconfirm, Skeleton, Typography } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUnit, deleteUnit, updateUnit } from "../../api/services/units";
import { useUnitsContext } from "../../contexts/UnitsContext";
import { CreateUnit, DeleteUnit, IUnits, UpdateUnit } from "../../models/units";
import FormUnitModal from "../Modal/FormModal/FormUnitModal";
import { CardTitle } from "./Units.styles";
const { Title } = Typography;

const Units = (): JSX.Element => {
  const {
    data: dataUnit,
    error,
    isLoading,
    isError,
    isFetching,
    setData,
    newUnitData,
  } = useUnitsContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<IUnits | null>(null);

  const itemsPerPage = 2;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginationTotal = newUnitData && newUnitData.length;
  const dataList = newUnitData && newUnitData.slice(start, end);

  const pagination = {
    current: currentPage,
    pageSize: itemsPerPage,
    total: paginationTotal,
    onChange: (page: number) => setCurrentPage(page),
  };

  function removeItemById(arr: IUnits[], variables: DeleteUnit): IUnits[] {
    return arr.filter((item) => item.id !== variables.id);
  }

  function updateItemById(arr: IUnits[], item: IUnits): IUnits[] {
    const index = arr.findIndex((currentItem) => currentItem.id === item.id);
    if (index !== -1) {
      const newArray = [...arr];
      newArray[index] = item;
      return newArray;
    }
    return arr;
  }

  const { mutate: mutateAddUnit } = useMutation(
    ({ body }: CreateUnit) => addUnit({ body }),
    {
      onSuccess: (data, variables) => {
        if (newUnitData) {
          const newId = Math.max(...newUnitData.map((item) => item.id)) + 1;
          const newItem = { ...data.data, id: newId };
          setData([...newUnitData, newItem]);
          toast.success("Unit added!");
        }
      },
    }
  );
  const { mutate: mutateUpdateUnit } = useMutation(
    ({ body, id }: UpdateUnit) => updateUnit({ body, id }),
    {
      onSuccess: (data, variables) => {
        if (newUnitData) {
          const newData = updateItemById(newUnitData, data.data);
          setData(newData);
          toast.success("Unit updated!");
        }
      },
      onError: (error: AxiosError, variables) => {
        const data: IUnits = {
          companyId: variables.body.companyId,
          name: variables.body.name,
          id: variables.id,
        };
        if (newUnitData) {
          setData(updateItemById(newUnitData, data));
          toast.success("Unit updated!");
        } else toast.error(`${error.message}`);
      },
    }
  );

  const { mutate: mutateRemoveUser } = useMutation(
    ({ id }: DeleteUnit) => deleteUnit({ id }),
    {
      onSuccess: (data, variables) => {
        if (newUnitData) {
          setData(removeItemById(newUnitData, variables));
          toast.success("Unit deleted!");
        }
      },
      onError: (error: AxiosError, variables) => {
        if (newUnitData) {
          setData(removeItemById(newUnitData, variables));
          setCurrentPage(currentPage - 1);
          toast.success("Unit deleted!");
        } else toast.error(`${error.message}`);
      },
    }
  );
  const showModal = (item: IUnits | null) => {
    setSelectedItem(item ?? null);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const confirm = (item: IUnits) => {
    mutateRemoveUser({ id: item.id });
  };

  function renderUnits() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataUnit) {
      return <Skeleton title={false} loading={isLoading} active></Skeleton>;
    } else {
      return (
        <Card
          title={
            <CardTitle>
              <Title level={3}>Units</Title>
              <Button onClick={() => showModal(null)}>New</Button>
            </CardTitle>
          }
        >
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={dataList}
            pagination={pagination}
            style={{ overflow: "auto" }}
            renderItem={(item: IUnits) => (
              <List.Item
                actions={[
                  <Button onClick={() => showModal(item)}>Edit</Button>,
                  <Popconfirm
                    title="Delete the unit"
                    description="Are you sure to delete this unit?"
                    onConfirm={() => confirm(item)}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                  >
                    <Button>Delete</Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta title={item.name} />
              </List.Item>
            )}
          />
        </Card>
      );
    }
  }

  return (
    <div>
      {renderUnits()}
      <FormUnitModal
        addUnit={mutateAddUnit}
        updateUnit={mutateUpdateUnit}
        isModalVisible={isModalVisible}
        selectedItem={selectedItem}
        setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
        onCancel={hideModal}
      />
      <ToastContainer />
    </div>
  );
};

export default Units;
