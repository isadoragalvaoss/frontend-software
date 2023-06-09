import { ArrowUpOutlined } from "@ant-design/icons";
import { Col, Statistic, Tooltip } from "antd";
import { DARK_BLUE, GREEN } from "../../consts/colors";
import { IAssets } from "../../models/assets";
import { IUnits } from "../../models/units";
import { IWorkOrders } from "../../models/workorders";
import { StatisticCardContainer } from "./StatisticCard.styles";

interface Props {
  data: IAssets[] | IWorkOrders[] | IUnits[] | undefined;
  title: string;
  value: number | undefined;
  assetsAverage?: boolean;
  isWorkOrders?: boolean;
}
export const StatisticCard = ({
  data,
  title,
  value,
  assetsAverage,
  isWorkOrders,
}: Props): JSX.Element => {
  const isAsset = (d: any): d is IAssets[] => Array.isArray(d);
  const isWorkOrder = (d: any): d is IWorkOrders[] => Array.isArray(d);
  const isUnit = (d: any): d is IUnits[] => Array.isArray(d);

  const getTooltip = () => {
    if ((isAsset(data) || isUnit(data)) && !isWorkOrders) {
      if (assetsAverage && isAsset(data))
        return data.map((d, index) => (
          <p key={index}>
            {d.name}: {d.healthscore}%
          </p>
        ));
      return data.map((d, index) => <p key={index}>{d.name}</p>);
    }
    if (isWorkOrder(data))
      return data.map((d, index) => <p key={index}>{d.title}</p>);
  };

  return (
    <Col lg={6} xs={24}>
      <StatisticCardContainer bordered={false}>
        <Tooltip
          placement="bottom"
          title={getTooltip}
          arrow={false}
          color={DARK_BLUE}
        >
          <Statistic
            title={title}
            value={value}
            precision={assetsAverage ? 2 : 0}
            valueStyle={{ color: assetsAverage ? GREEN : DARK_BLUE }}
            prefix={assetsAverage && <ArrowUpOutlined />}
            suffix={assetsAverage && "%"}
          />
        </Tooltip>
      </StatisticCardContainer>
    </Col>
  );
};

export default StatisticCard;
