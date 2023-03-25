import {
  Badge,
  Button,
  Col,
  Descriptions,
  Image,
  Pagination,
  Progress,
  Row,
  Tag,
} from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { addAsset, deleteAsset, updateAsset } from "../../api/services/assets";
import AssignedModal from "../../components/Modal/AssignedModal";
import FormAssetModal from "../../components/Modal/FormModal/FormAssetModal";
import { DARK_BLUE } from "../../consts/colors";
import { useAssetsContext } from "../../contexts/AssetsContext";
import {
  CreateAsset,
  DeleteAsset,
  IAssets,
  Metrics,
  Specifics,
  UpdateAsset,
} from "../../models/assets";
import { AssetsCard, AssetsContainer } from "./Assets.styles";

const SpecificationsList = ({ specifications }: Specifics) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }}
  >
    <span>Max Temp (Celsius): {specifications?.maxTemp}</span>
    <span>Power (kWh): {specifications?.power}</span>
    <span>RPM: {specifications?.rpm}</span>
  </div>
);

const MetricsList = ({ metrics }: Metrics) => {
  const date = new Date(metrics.lastUptimeAt);
  const formattedDate = date.toLocaleString();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <span>Last Uptime:: {formattedDate}</span>
      <span>Total Collects Uptime:: {metrics.totalCollectsUptime}</span>
      <span>Total Uptime:: {metrics.totalUptime.toFixed(2)}</span>
    </div>
  );
};

const PAGE_SIZE = 1;
const Assets = (): JSX.Element => {
  const {
    data: dataAsset,
    error,
    isLoading,
    isError,
    isFetching,
  } = useAssetsContext();
  const [isAssignedOpen, setIsAssignedOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<IAssets | null>(null);
  const [dataTotal, setDataTotal] = useState<IAssets[]>([]);
  const hasDataTotal = dataTotal?.length !== 0;

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

  const { mutate: mutateAsset } = useMutation(
    ({ body }: CreateAsset) => addAsset({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasDataTotal)
          setDataTotal([...(dataAsset?.data ?? []), data.data]);
        else setDataTotal([...dataTotal, data.data]);
      },
    }
  );

  const { mutate: mutateUpdateAsset } = useMutation(
    ({ body, id }: UpdateAsset) => updateAsset({ body, id }),
    {
      onSuccess: (data, variables) => {
        function updateItemById(arr: IAssets[], item: IAssets): IAssets[] {
          return arr.map((currentItem) => {
            if (currentItem.id === item.id) {
              return item;
            }
            return currentItem;
          });
        }

        if (!hasDataTotal && dataAsset) {
          const newData = updateItemById(dataAsset?.data, data.data);
          setDataTotal(newData);
        } else {
          const newData = updateItemById(dataTotal, data.data);
          setDataTotal(newData);
        }
      },
    }
  );

  const { mutate: mutateRemoveWorkOrder } = useMutation(
    ({ id }: DeleteAsset) => deleteAsset({ id }),
    {
      onSuccess: (data, variables) => {
        function removeItemById(arr: IAssets[]): IAssets[] {
          return arr.filter((item) => item.id !== variables.id);
        }

        if (!hasDataTotal && dataAsset)
          setDataTotal(removeItemById(dataAsset?.data));
        else setDataTotal(removeItemById(dataTotal));
      },
    }
  );

  function renderAssets() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataAsset) {
      return <div>Loading...</div>;
    } else {
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const currentData = hasDataTotal
        ? dataTotal.slice(start, end)
        : dataAsset?.data.slice(start, end);

      const handleChangePage = (page: number) => {
        setCurrentPage(page);
      };
      return (
        <>
          <AssetsContainer>
            {currentData.map((item) => {
              return (
                <AssetsCard title={item.name} bordered={false} key={item.id}>
                  <Row>
                    <Col key={item.id} lg={8} xs={24}>
                      <Image src={item.image} width={200} />
                    </Col>
                    <Col key={item.id} lg={16} xs={24}>
                      <Descriptions bordered>
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
                          {item.unitId}
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
                          <Button onClick={showAssignedModal}>Assigned</Button>
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
                  <Button onClick={() => showFormModal(item)}>Edit</Button>
                </AssetsCard>
              );
            })}
          </AssetsContainer>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={hasDataTotal ? dataTotal.length : dataAsset.data.length}
            onChange={handleChangePage}
          />
        </>
      );
    }
  }
  return (
    <>
      {renderAssets()}

      <Button onClick={() => setIsFormOpen(!isFormOpen)}>Form</Button>
      <FormAssetModal
        addAsset={mutateAsset}
        updateAsset={mutateUpdateAsset}
        isModalVisible={isFormOpen}
        selectedItem={selectedAsset}
        setIsModalVisible={() => setIsFormOpen(!isFormOpen)}
        onCancel={handleForm}
      />
    </>
  );
};

export default Assets;
