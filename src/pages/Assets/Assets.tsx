import {
  Badge,
  Button,
  Col,
  Descriptions,
  Image,
  Pagination,
  Popconfirm,
  Progress,
  Row,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addAsset, deleteAsset, updateAsset } from "../../api/services/assets";
import MetricsList from "../../components/List/MetricsList";
import SpecificationsList from "../../components/List/SpecificationsList";
import AssignedModal from "../../components/Modal/AssignedModal";
import FormAssetModal from "../../components/Modal/FormModal/FormAssetModal";
import { DARK_BLUE } from "../../consts/colors";
import { useAssetsContext } from "../../contexts/AssetsContext";
import { useUnitsContext } from "../../contexts/UnitsContext";
import {
  CreateAsset,
  DeleteAsset,
  IAssets,
  UpdateAsset,
} from "../../models/assets";
import {
  AssetsCard,
  AssetsContainer,
  ButtonsContainer,
  CardTitle,
} from "./Assets.styles";
const { Title } = Typography;

const Assets = (): JSX.Element => {
  const {
    data: dataAsset,
    error,
    isLoading,
    isError,
    isFetching,
    newAssetData,
    setData,
  } = useAssetsContext();
  const [isAssignedOpen, setIsAssignedOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<IAssets | null>(null);

  const itemsPerPage = 1;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const hasNewAssetData = newAssetData && newAssetData.length > 0;
  const paginationTotal = hasNewAssetData
    ? newAssetData.length
    : dataAsset?.data.length;

  const dataList = hasNewAssetData
    ? newAssetData.slice(start, end)
    : dataAsset?.data.slice(start, end);

  const { newUnitData, data: UnitsData } = useUnitsContext();
  const unitData =
    newUnitData && newUnitData?.length > 0 ? newUnitData : UnitsData?.data;

  function findNameById(id: number) {
    if (unitData)
      for (let i = 0; i < unitData.length; i++) {
        if (unitData[i].id === id) {
          return unitData[i].name;
        }
      }
    return null;
  }

  function removeItemById(arr: IAssets[], variables: DeleteAsset): IAssets[] {
    return arr.filter((item) => item.id !== variables.id);
  }

  function updateItemById(arr: IAssets[], item: IAssets): IAssets[] {
    const index = arr.findIndex((currentItem) => currentItem.id === item.id);
    if (index !== -1) {
      const newArray = [...arr];
      newArray[index] = item;
      return newArray;
    }
    return arr;
  }

  const { mutate: mutateAsset } = useMutation(
    ({ body }: CreateAsset) => addAsset({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewAssetData) setData([...(dataAsset?.data ?? []), data.data]);
        else {
          const newId = Math.max(...newAssetData.map((item) => item.id)) + 1;
          const newItem = { ...data.data, id: newId };
          setData([...newAssetData, newItem]);
        }
        toast.success("Asset added!");
      },
    }
  );

  const { mutate: mutateUpdateAsset } = useMutation(
    ({ body, id }: UpdateAsset) => updateAsset({ body, id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewAssetData && dataAsset) {
          const newData = updateItemById(dataAsset?.data, data.data);
          setData(newData);
        } else {
          if (newAssetData) {
            const newData = updateItemById(newAssetData, data.data);
            setData(newData);
          }
        }
        toast.success("Asset updated!");
      },
      onError: (error: AxiosError, variables) => {
        const data: IAssets = {
          id: variables.id,
          assignedUserIds: variables.body.assignedUserIds,
          companyId: variables.body.companyId,
          healthHistory: variables.body.healthHistory,
          healthscore: variables.body.healthscore,
          image: variables.body.image,
          metrics: variables.body.metrics,
          model: variables.body.model,
          name: variables.body.name,
          sensors: variables.body.sensors,
          specifications: variables.body.specifications,
          status: variables.body.status,
          unitId: variables.body.unitId,
        };
        if (newAssetData) {
          setData(updateItemById(newAssetData, data));
          toast.success("Asset updated!");
        } else toast.error(`${error.message}`);
      },
    }
  );

  const { mutate: mutateRemoveWorkOrder } = useMutation(
    ({ id }: DeleteAsset) => deleteAsset({ id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewAssetData && dataAsset)
          setData(removeItemById(dataAsset?.data, variables));
        else {
          if (newAssetData) {
            setData(removeItemById(newAssetData, variables));
          }
        }
        toast.success("Asset deleted!");
      },
      onError: (error: AxiosError, variables) => {
        if (newAssetData) {
          setData(removeItemById(newAssetData, variables));
          if (currentPage > 1) setCurrentPage(currentPage - 1);
          toast.success("Asset deleted!");
        } else toast.error(`${error.message}`);
      },
    }
  );

  const showFormModal = (asset: IAssets | null) => {
    setSelectedAsset(asset);
    setIsFormOpen(!isFormOpen);
  };

  const handleForm = () => {
    setIsFormOpen(false);
    setSelectedAsset(null);
  };

  const showAssignedModal = () => {
    setIsAssignedOpen(true);
  };

  const handleAssigned = () => {
    setIsAssignedOpen(false);
  };

  const confirm = (item: IAssets) => {
    mutateRemoveWorkOrder({ id: item.id });
  };

  function renderAssets() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataAsset) {
      return <div>Loading...</div>;
    } else {
      return (
        <>
          <AssetsContainer>
            {dataList &&
              dataList.map((item) => {
                return (
                  <AssetsCard
                    title={
                      <CardTitle>
                        <Title level={3}>{item.name}</Title>
                        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
                          New
                        </Button>
                      </CardTitle>
                    }
                    bordered={false}
                    key={item.id}
                  >
                    <Row>
                      <Col lg={8} xs={24}>
                        <Image src={item.image} width={200} />
                      </Col>
                      <Col lg={16} xs={24}>
                        <Descriptions bordered style={{ overflow: "auto" }}>
                          <Descriptions.Item label="Model">
                            {item.model === "model" ? (
                              <Tag color="success">{item.model}</Tag>
                            ) : (
                              <Tag color="processing">{item.model}</Tag>
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="Sensors">
                            {item.sensors}
                          </Descriptions.Item>
                          <Descriptions.Item label="Unit">
                            <Tooltip
                              placement="bottom"
                              title={findNameById(item.unitId)}
                              arrow={false}
                              color={DARK_BLUE}
                            >
                              {item.unitId}
                            </Tooltip>
                          </Descriptions.Item>

                          <Descriptions.Item label="Health Score">
                            <Progress
                              type="circle"
                              percent={item.healthscore}
                              strokeColor={DARK_BLUE}
                            />
                          </Descriptions.Item>

                          <Descriptions.Item label="Specifications" span={2}>
                            <SpecificationsList
                              specifications={item.specifications}
                            />
                          </Descriptions.Item>

                          <Descriptions.Item label="Metrics" span={3}>
                            <MetricsList metrics={item.metrics} />
                          </Descriptions.Item>

                          <Descriptions.Item label="Assigned user">
                            <Button onClick={showAssignedModal}>
                              Assigned
                            </Button>
                            <AssignedModal
                              isModalOpen={isAssignedOpen}
                              handleCancel={handleAssigned}
                              handleOk={handleAssigned}
                              assignedUsers={item.assignedUserIds}
                            />
                          </Descriptions.Item>
                          <Descriptions.Item label="Status">
                            <Badge status="warning" text={item.status} />
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>
                    <ButtonsContainer>
                      <Button onClick={() => showFormModal(item)}>Edit</Button>
                      <Popconfirm
                        title="Delete the asset"
                        description="Are you sure to delete this asset?"
                        onConfirm={() => confirm(item)}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                      >
                        <Button>Delete</Button>
                      </Popconfirm>
                    </ButtonsContainer>
                  </AssetsCard>
                );
              })}
          </AssetsContainer>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={paginationTotal}
            onChange={(page: number) => setCurrentPage(page)}
          />
        </>
      );
    }
  }
  return (
    <div>
      {renderAssets()}

      <FormAssetModal
        addAsset={mutateAsset}
        updateAsset={mutateUpdateAsset}
        isModalVisible={isFormOpen}
        selectedItem={selectedAsset}
        setIsModalVisible={() => setIsFormOpen(!isFormOpen)}
        onCancel={handleForm}
      />
      <ToastContainer />
    </div>
  );
};

export default Assets;
