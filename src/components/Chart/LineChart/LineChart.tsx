import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { IAssets } from "../../../models/assets";

interface LineChartProps {
  data: IAssets[];
}
const LineChart = ({ data }: LineChartProps): JSX.Element => {
  const options = {
    title: {
      text: "Assets Health History - December",
    },
    xAxis: {
      categories: Array.from({ length: 31 }, (_, i) => `2022-12-${i + 1}`),
    },
    yAxis: {
      title: {
        text: "Status",
      },
      categories: [
        "",
        "1-IN DOWNTIME",
        "2-UNPLANNED STOP",
        "3-PLANNED STOP",
        "4-IN ALERT",
        "5-IN OPERATION",
      ],
    },
    series: data.map(({ name, healthHistory }) => ({
      name,
      data: healthHistory.map(({ timestamp, status }) => {
        const day = parseInt(timestamp.substring(8, 10)) - 1;
        const statusIndex =
          [
            "inDowntime",
            "unplannedStop",
            "plannedStop",
            "inAlert",
            "inOperation",
          ].indexOf(status) + 1;
        return [day, statusIndex];
      }),
    })),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;
