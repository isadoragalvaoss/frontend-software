import { Col, Row } from "antd";
import Companies from "../../components/Companies";
import Units from "../../components/Units";
import Users from "../../components/Users";

const Manage = (): JSX.Element => {
  return (
    <Row gutter={[16, 16]}>
      <Col lg={16} xs={24}>
        <Users />
      </Col>
      <Col lg={8} xs={24}>
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          <Col span={24}>
            <Companies />
          </Col>
          <Col span={24}>
            <Units />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Manage;
