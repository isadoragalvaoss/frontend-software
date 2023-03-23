import { DatabaseOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Result, Typography } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/tractian-logo.png";
import { useCompaniesContext } from "../../contexts/CompaniesContext/CompaniesContext";
import Assets from "../Assets";
import Dashboard from "../Dashboard";
import Manage from "../Manage";
import WorkOrders from "../WorkOrders";

const { Header, Content, Sider } = Layout;

export const Main = (): JSX.Element => {
  const location = useLocation();
  const [selectedRoute, setSelectedRoute] = useState(location.pathname);
  const navigate = useNavigate();
  const { data: CompanyData } = useCompaniesContext();

  const handleRouteClick = (route: string) => {
    setSelectedRoute(route);
    navigate(route);
  };

  const { Title } = Typography;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu
          theme="dark"
          selectedKeys={[selectedRoute]}
          onClick={({ key }) => handleRouteClick(key)}
          style={{ marginTop: "64px" }}
        >
          <Menu.Item key="/dashboard" icon={<DatabaseOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="/workorders" icon={<DatabaseOutlined />}>
            WorkOrders
          </Menu.Item>
          <Menu.Item key="/assets" icon={<DatabaseOutlined />}>
            Assets
          </Menu.Item>
          <Menu.Item key="/manage" icon={<SettingOutlined />}>
            Manage
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={Logo} width={200} />
          {CompanyData?.data && (
            <Title level={5} type="secondary">
              {CompanyData.data[0].name}
            </Title>
          )}
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {selectedRoute === "/manage" && <Manage />}
            {selectedRoute === "/assets" && <Assets />}
            {selectedRoute === "/dashboard" && <Dashboard />}
            {selectedRoute === "/workorders" && <WorkOrders />}
            {selectedRoute === "*" && (
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
              />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
