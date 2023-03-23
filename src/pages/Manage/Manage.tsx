import { Card, Col, Row } from "antd";
import Users from "../../components/Users";

const Manage = (): JSX.Element => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Users />
      </Col>
      <Col span={8}>
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          <Col span={24}>
            <Card title="Companies" style={{ height: "50%" }}>
              Conteúdo do card 1
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Units" style={{ height: "50%" }}>
              Conteúdo do card 2
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Manage;
