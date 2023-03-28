import { Metrics } from "../../../models/assets";
import { MetricsContainer } from "./MetricsList.styles";

const MetricsList = ({ metrics }: Metrics): JSX.Element => {
  const date = new Date(metrics.lastUptimeAt);
  const formattedDate = date.toLocaleString();

  return (
    <MetricsContainer>
      <span>Last Uptime: {formattedDate}</span>
      <span>Total Collects Uptime: {metrics.totalCollectsUptime}</span>
      <span>Total Uptime: {metrics.totalUptime?.toFixed(2)}</span>
    </MetricsContainer>
  );
};
export default MetricsList;
