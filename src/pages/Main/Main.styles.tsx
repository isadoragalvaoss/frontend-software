import { Avatar, Layout, Menu, Row, Typography } from "antd";
import styled from "styled-components";
import { GRAY, WHITE } from "../../consts/colors";
const { Title } = Typography;
const { Header, Content } = Layout;

export const LayoutContainer = styled(Layout)`
  min-height: 100vh;
`;
export const CompanyDataContainer = styled(Row)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;
export const TitleContainer = styled(Title)`
  color: ${WHITE} !important;
  margin: 0 !important;
`;

export const AvatarContainer = styled(Avatar)`
  background-color: ${GRAY};
`;

export const MenuContainer = styled(Menu)`
  margin-top: 30px;
`;
export const HeaderContainer = styled(Header)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LayoutContent = styled(Content)`
  padding: 24px;
  min-height: 360px;
`;
