import { Col, Row } from "antd";
import LineChart from "../../components/Chart/LineChart";
import PieChart from "../../components/Chart/PieChart";
import StatisticCard from "../../components/StatisticCard";
import { useAssetsContext } from "../../contexts/AssetsContext";
import { useUnitsContext } from "../../contexts/UnitsContext";
import { useWorkOrdersContext } from "../../contexts/WorkOrdersContext";
import { IAssets } from "../../models/assets";
import {
  DashboardContainer,
  GraphicsCard,
  StatisticCardsContainer,
} from "./Dashboard.styles";

const Dashboard = (): JSX.Element => {
  const { data: AssetsData } = useAssetsContext();
  const { data: WorkOrdersData } = useWorkOrdersContext();
  const { data: UnitsData } = useUnitsContext();

  function healthAverage(arr: IAssets[] | undefined): number {
    let somaHealthScore = 0;
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        somaHealthScore += arr[i].healthscore;
      }
      const mediaHealthScore = somaHealthScore / arr.length;
      return Number(mediaHealthScore.toFixed(2));
    } else return 0;
  }

  return (
    <DashboardContainer>
      <StatisticCardsContainer gutter={[16, 16]}>
        <StatisticCard
          data={AssetsData?.data}
          title="Assets average health"
          value={healthAverage(AssetsData?.data)}
          assetsAverage
        />
        <StatisticCard
          data={AssetsData?.data}
          title="Total Assets"
          value={AssetsData?.data.length}
        />
        <StatisticCard
          data={WorkOrdersData?.data}
          title="Total WorkOrders"
          value={WorkOrdersData?.data.length}
          isWorkOrders
        />
        <StatisticCard
          data={UnitsData?.data}
          title="Total Units"
          value={UnitsData?.data.length}
        />
      </StatisticCardsContainer>
      <Row gutter={[16, 16]}>
        <Col lg={16} xs={24}>
          <GraphicsCard>
            {AssetsData?.data && <LineChart data={AssetsData?.data} />}
          </GraphicsCard>
        </Col>
        <Col lg={8} xs={24}>
          <GraphicsCard>
            {WorkOrdersData?.data && <PieChart data={WorkOrdersData?.data} />}
          </GraphicsCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;
