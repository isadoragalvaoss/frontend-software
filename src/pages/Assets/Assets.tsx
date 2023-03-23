import { Badge, Card, Col, Descriptions, Image, Pagination, Row } from "antd";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useAssetsContext } from "../../contexts/AssetsContext/AssetsContext";

const PAGE_SIZE = 1;
const Assets = (): JSX.Element => {
  // Access the client
  const queryClient = useQueryClient();
  const { data, error, isLoading, isError, isFetching } = useAssetsContext();

  const [currentPage, setCurrentPage] = useState(1);

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
        <div>
          <Row
            style={{
              justifyContent: "center",
            }}
          >
            {currentData.map((item) => (
              <Card title={item.name} bordered={false} key={item.id}>
                <Row>
                  <Col key={item.id} lg={8} xs={24}>
                    <Image src={item.image} width={200} />
                  </Col>
                  <Col key={item.id} lg={16} xs={24}>
                    <Descriptions bordered>
                      <Descriptions.Item label="Model">
                        {item.model}
                      </Descriptions.Item>
                      <Descriptions.Item label="Health Score">
                        {item.healthscore}
                      </Descriptions.Item>
                      <Descriptions.Item label="Automatic Renewal">
                        YES
                      </Descriptions.Item>
                      <Descriptions.Item label="Order time">
                        2018-04-24 18:00:00
                      </Descriptions.Item>
                      <Descriptions.Item label="Usage Time" span={2}>
                        2019-04-24 18:00:00
                      </Descriptions.Item>
                      <Descriptions.Item label="Status" span={3}>
                        <Badge status="warning" text={item.status} />
                      </Descriptions.Item>
                      <Descriptions.Item label="Negotiated Amount">
                        $80.00
                      </Descriptions.Item>
                      <Descriptions.Item label="Discount">
                        $20.00
                      </Descriptions.Item>
                      <Descriptions.Item label="Official Receipts">
                        $60.00
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            ))}
          </Row>
          <br />
          <br />
          <br />
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={data.data.length}
            onChange={handleChangePage}
          />
        </div>
      );
    }
  }
  return <div>{renderAssets()}</div>;
};

export default Assets;
