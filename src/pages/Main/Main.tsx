import {
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Layout, Menu } from "antd";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/tractian-logo.png";
import { useCompaniesContext } from "../../contexts/CompaniesContext";
import { selectedRoutes } from "../../utils";
import {
  AvatarContainer,
  CompanyDataContainer,
  HeaderContainer,
  LayoutContainer,
  LayoutContent,
  MenuContainer,
  TitleContainer,
} from "./Main.styles";

export const Main = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: CompanyData, newCompanyData } = useCompaniesContext();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { Sider } = Layout;

  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(location.pathname);

  const hasCompanyData =
    newCompanyData && newCompanyData?.length > 0
      ? newCompanyData
      : CompanyData?.data;
  const companyName = hasCompanyData && hasCompanyData[0].name;
  const colAvatar = menuOpen ? 6 : 24;
  const imgHeader = isMobile ? 100 : 200;

  const handleRouteClick = (route: string) => {
    setSelectedRoute(route);
    navigate(route);
  };

  const handleOpenMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    { name: "Dashboard", key: "/dashboard", icon: <DatabaseOutlined /> },
    { name: "WorkOrders", key: "/workOrders", icon: <DatabaseOutlined /> },
    { name: "Assets", key: "/assets", icon: <DatabaseOutlined /> },
    { name: "Manage", key: "/manage", icon: <SettingOutlined /> },
  ];

  return (
    <LayoutContainer>
      <Sider collapsible>
        {hasCompanyData && (
          <CompanyDataContainer>
            <Col span={18}>
              {menuOpen && (
                <TitleContainer level={5}>{companyName}</TitleContainer>
              )}
            </Col>
            <Col span={colAvatar}>
              <AvatarContainer size={40} icon={<UserOutlined />} />
            </Col>
          </CompanyDataContainer>
        )}
        <MenuContainer
          theme="dark"
          selectedKeys={[selectedRoute]}
          onClick={({ key }) => {
            handleRouteClick(key);
          }}
          onOpenChange={handleOpenMenu}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.name}
            </Menu.Item>
          ))}
        </MenuContainer>
      </Sider>
      <Layout>
        <HeaderContainer>
          <img src={Logo} width={imgHeader} />
        </HeaderContainer>
        <LayoutContent>{selectedRoutes(selectedRoute)}</LayoutContent>
      </Layout>
    </LayoutContainer>
  );
};

export default Main;
