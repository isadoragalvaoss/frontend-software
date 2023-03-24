import { Badge, Button, Col, Descriptions, Image, Pagination, Row } from "antd";
import { useState } from "react";
import AssignedModal from "../../components/Modal/AssignedModal";
import { useAssetsContext } from "../../contexts/AssetsContext";
import { AssetsCard, AssetsContainer } from "./Assets.styles";

const PAGE_SIZE = 1;
const Assets = (): JSX.Element => {
  const { data, error, isLoading, isError, isFetching } = useAssetsContext();
  const [isAssignedOpen, setIsAssignedOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const showAssignedModal = () => {
    setIsAssignedOpen(true);
  };

  const handleAssigned = () => {
    setIsAssignedOpen(false);
  };

  function renderAssets() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !data) {
      return <div>Loading...</div>;
    } else {
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const currentData = data.data.slice(startIndex, endIndex);

      const handleChangePage = (page: number) => {
        setCurrentPage(page);
      };
      return (
        <>
          <AssetsContainer>
            {currentData.map((item) => {
              const date = new Date(item.metrics.lastUptimeAt);
              const formattedDate = date.toLocaleString();
              return (
                <AssetsCard title={item.name} bordered={false} key={item.id}>
                  <Row>
                    <Col key={item.id} lg={8} xs={24}>
                      <Image src={item.image} width={200} />
                    </Col>
                    <Col key={item.id} lg={16} xs={24}>
                      <Descriptions bordered>
                        <Descriptions.Item label="Model" span={2}>
                          {item.model}
                        </Descriptions.Item>
                        <Descriptions.Item label="Sensors" span={2}>
                          {item.sensors}
                        </Descriptions.Item>

                        <Descriptions.Item label="Health Score">
                          {item.healthscore}
                        </Descriptions.Item>
                        <Descriptions.Item label="Unit">
                          {item.unitId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Specifications">
                          <p>Max Temp: {item.specifications.maxTemp}</p>
                          <p>Power: {item.specifications.power ?? "-"}</p>
                          <p>Rpm: {item.specifications.rpm ?? "-"}</p>
                        </Descriptions.Item>

                        <Descriptions.Item label="Metrics" span={3}>
                          <p>- Last Uptime: {formattedDate}</p>
                          <p>
                            - Total Collects Uptime:{" "}
                            {item.metrics.totalCollectsUptime}
                          </p>
                          <p>
                            - Total Uptime:{" "}
                            {item.metrics.totalUptime.toFixed(2)}
                          </p>
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
                </AssetsCard>
              );
            })}
          </AssetsContainer>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={data.data.length}
            onChange={handleChangePage}
          />
        </>
      );
    }
  }
  return <>{renderAssets()}</>;
};

export default Assets;
