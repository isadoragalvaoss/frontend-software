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
  const { data: AssetsData, newAssetData } = useAssetsContext();
  const assetData =
    newAssetData && newAssetData?.length > 0 ? newAssetData : AssetsData?.data;

  const { data: WorkOrdersData, newWorkOrderData } = useWorkOrdersContext();
  const workOrderData =
    newWorkOrderData && newWorkOrderData?.length > 0
      ? newWorkOrderData
      : WorkOrdersData?.data;

  const { newUnitData, data: UnitsData } = useUnitsContext();
  const unitData =
    newUnitData && newUnitData?.length > 0 ? newUnitData : UnitsData?.data;

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
        {assetData && (
          <>
            <StatisticCard
              data={assetData}
              title="Assets average health"
              value={healthAverage(assetData)}
              assetsAverage
            />
            <StatisticCard
              data={assetData}
              title="Total Assets"
              value={assetData.length}
            />
          </>
        )}
        {workOrderData && (
          <StatisticCard
            data={workOrderData}
            title="Total WorkOrders"
            value={workOrderData.length}
            isWorkOrders
          />
        )}
        {unitData && (
          <StatisticCard
            data={unitData}
            title="Total Units"
            value={unitData.length}
          />
        )}
      </StatisticCardsContainer>
      <Row gutter={[16, 16]}>
        <Col lg={16} xs={24}>
          <GraphicsCard>
            {assetData && <LineChart data={assetData} />}
          </GraphicsCard>
        </Col>
        <Col lg={8} xs={24}>
          <GraphicsCard>
            {workOrderData && <PieChart data={workOrderData} />}
          </GraphicsCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;
