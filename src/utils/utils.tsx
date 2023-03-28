import { Result } from "antd";
import Assets from "../pages/Assets";
import Dashboard from "../pages/Dashboard";
import Manage from "../pages/Manage";
import WorkOrders from "../pages/WorkOrders";

export const selectedRoutes = (route: string) => {
  const routes: { [key: string]: JSX.Element } = {
    manage: <Manage />,
    assets: <Assets />,
    dashboard: <Dashboard />,
    workOrders: <WorkOrders />,
  };

  const correctRoute = route.split("/")[1];

  if (correctRoute === "") {
    return routes["dashboard"];
  }

  return (
    routes[correctRoute] ?? (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    )
  );
};
