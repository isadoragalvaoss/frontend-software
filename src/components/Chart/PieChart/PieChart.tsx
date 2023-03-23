import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import { IWorkOrders } from "../../../models/workorders";

interface PieChartProps {
  data: IWorkOrders[];
}

const PieChart = ({ data }: PieChartProps): JSX.Element => {
  const inProgressCount = data.filter(
    (task) => task.status === "in progress"
  ).length;
  const completedCount = data.filter(
    (task) => task.status === "completed"
  ).length;

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
    },
    title: {
      text: "WorkOrders Progress",
    },
    series: [
      {
        type: "pie",
        name: "Status",
        data: [
          {
            name: "In Progress",
            y: inProgressCount,
          },
          {
            name: "Completed",
            y: completedCount,
          },
        ],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default PieChart;
