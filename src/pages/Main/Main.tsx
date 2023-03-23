import {
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Layout,
  Menu,
  Result,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
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
  const [menuOpen, setMenuOpen] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        {CompanyData?.data && (
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <Col span={18}>
              {menuOpen && (
                <Title level={5} style={{ color: "#fff", margin: 0 }}>
                  {CompanyData.data[0].name}
                </Title>
              )}
            </Col>
            <Col span={menuOpen ? 6 : 24}>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                style={{ backgroundColor: "gray" }}
              />
            </Col>
          </Row>
        )}
        <Menu
          theme="dark"
          selectedKeys={[selectedRoute]}
          onClick={({ key }) => {
            handleRouteClick(key);
          }}
          style={{ marginTop: "30px" }}
          onOpenChange={() => {
            setMenuOpen(!menuOpen);
          }}
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={Logo} width={isMobile ? 100 : 200} />
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
