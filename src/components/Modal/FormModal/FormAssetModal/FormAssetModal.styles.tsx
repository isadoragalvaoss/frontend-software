import { Form, Space } from "antd";
import styled from "styled-components";

export const SpaceHealthHistory = styled(Space)`
  display: flex;
  margin-bottom: 8;
`;

interface SelectedItemsProps {
  large?: boolean;
}

export const SelectItem = styled(Form.Item)<SelectedItemsProps>`
  width: ${(props) => (props.large ? "250px" : "150px")};
`;

export const ContainerFlex = styled.div`
  display: flex;
  gap: 10px;
`;
