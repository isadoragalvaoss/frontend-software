import { ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import LineChart from "../../components/Chart/LineChart";
import PieChart from "../../components/Chart/PieChart";
import { useAssetsContext } from "../../contexts/AssetsContext/AssetsContext";
import { useUnitsContext } from "../../contexts/UnitsContext/UnitsContext";
import { useWorkOrdersContext } from "../../contexts/WorkOrdersContext/WorkOrdersContext";
import { IAssets } from "../../models/assets";

const Dashboard = (): JSX.Element => {
  const { data: AssetsData } = useAssetsContext();
  const { data: WorkOrdersData } = useWorkOrdersContext();
  const { data: UnitsData } = useUnitsContext();

  function healthAverage(arr: IAssets[] | undefined): number {
    let somaHealthscore = 0;
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        somaHealthscore += arr[i].healthscore;
      }
      const mediaHealthscore = somaHealthscore / arr.length;
      return Number(mediaHealthscore.toFixed(2));
    } else return 0;
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: "15px" }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Assets average health"
              value={healthAverage(AssetsData?.data)}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Assets"
              value={AssetsData?.data.length}
              valueStyle={{ color: "#001529" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total WorkOrders"
              value={WorkOrdersData?.data.length}
              valueStyle={{ color: "#001529" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          {UnitsData?.data && (
            <Card bordered={false}>
              <Statistic
                title="Total Units"
                value={UnitsData?.data.length}
                valueStyle={{ color: "#001529" }}
              />
            </Card>
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card style={{ width: "100%" }}>
            {AssetsData?.data && <LineChart data={AssetsData?.data} />}
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ width: "100%" }}>
            {WorkOrdersData?.data && <PieChart data={WorkOrdersData?.data} />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
