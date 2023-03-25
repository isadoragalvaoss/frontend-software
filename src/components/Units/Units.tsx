import { Button, Card, List, Skeleton, Typography } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
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
  } = useUnitsContext();
  const [dataTotal, setDataTotal] = useState<IUnits[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const hasDataTotal = dataTotal?.length !== 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<IUnits | null>(null);

  const itemsPerPage = 2;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const dataList = hasDataTotal
    ? dataTotal.slice(start, end)
    : dataUnit?.data.slice(start, end);
  const pagination = {
    current: currentPage,
    pageSize: itemsPerPage,
    total: hasDataTotal ? dataTotal.length : dataUnit?.data.length,
    onChange: (page: number) => setCurrentPage(page),
  };

  const { mutate: mutateAddUnit } = useMutation(
    ({ body }: CreateUnit) => addUnit({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasDataTotal) setDataTotal([...(dataUnit?.data ?? []), data.data]);
        else setDataTotal([...dataTotal, data.data]);
      },
    }
  );

  const { mutate: mutateUpdateUnit } = useMutation(
    ({ body, id }: UpdateUnit) => updateUnit({ body, id }),
    {
      onSuccess: (data, variables) => {
        function updateItemById(arr: IUnits[], item: IUnits): IUnits[] {
          return arr.map((currentItem) => {
            if (currentItem.id === item.id) {
              return item;
            }
            return currentItem;
          });
        }

        if (!hasDataTotal && dataUnit) {
          const newData = updateItemById(dataUnit?.data, data.data);
          setDataTotal(newData);
        } else {
          const newData = updateItemById(dataTotal, data.data);
          setDataTotal(newData);
        }
      },
    }
  );

  const { mutate: mutateRemoveUser } = useMutation(
    ({ id }: DeleteUnit) => deleteUnit({ id }),
    {
      onSuccess: (data, variables) => {
        function removeItemById(arr: IUnits[]): IUnits[] {
          return arr.filter((item) => item.id !== variables.id);
        }

        if (!hasDataTotal && dataUnit)
          setDataTotal(removeItemById(dataUnit?.data));
        else setDataTotal(removeItemById(dataTotal));
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
                  <Button onClick={() => mutateRemoveUser({ id: item.id })}>
                    Delete
                  </Button>,
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
    </div>
  );
};

export default Units;
