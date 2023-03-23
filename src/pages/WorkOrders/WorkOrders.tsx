import { Button, Col, Row, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import AssignedModal from "../../components/Modal/AssignedModal";
import CheckListModal from "../../components/Modal/CheckListModal";
import { useWorkOrdersContext } from "../../contexts/WorkOrdersContext/WorkOrdersContext";
import { IWorkOrders } from "../../models/workorders";

export const WorkOrders = (): JSX.Element => {
  const { data } = useWorkOrdersContext();

  const [isCheckListOpen, setIsCheckListOpen] = useState(false);
  const [isAssignedOpen, setIsAssignedOpen] = useState(false);

  const [selectedWorkOrder, setSelectedWorkOrder] =
    useState<IWorkOrders | null>(null);

  const showCheckListModal = (workOrder: IWorkOrders) => {
    setSelectedWorkOrder(workOrder);
    setIsCheckListOpen(true);
  };

  const handleCheckList = () => {
    setSelectedWorkOrder(null);
    setIsCheckListOpen(false);
  };

  const showAssignedModal = (workOrder: IWorkOrders) => {
    setSelectedWorkOrder(workOrder);
    setIsAssignedOpen(true);
  };

  const handleAssigned = () => {
    setSelectedWorkOrder(null);
    setIsAssignedOpen(false);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Priority",
      key: "priority",
      render: ({ priority }: IWorkOrders) => (
        <>{priority === "high" && <Tag color="error">HIGH</Tag>}</>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: ({ status }: IWorkOrders) => (
        <>
          {status === "completed" && <Tag color="success">COMPLETED</Tag>}
          {status === "in progress" && (
            <Tag color="processing">IN PROGRESS</Tag>
          )}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (workOrder: IWorkOrders) => (
        <Space size="middle">
          <Button onClick={() => showCheckListModal(workOrder)}>
            CheckList
          </Button>
          <Button onClick={() => showAssignedModal(workOrder)}>Assigned</Button>
        </Space>
      ),
    },
  ];

  const { Title } = Typography;

  return (
    <Row>
      <Col span={24}>
        <Table
          dataSource={data?.data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          title={() => <Title level={2}>Work Orders</Title>}
          scroll={{ x: "min-content" }}
        />
        <CheckListModal
          isModalOpen={isCheckListOpen}
          handleCancel={handleCheckList}
          handleOk={handleCheckList}
          checkList={selectedWorkOrder?.checklist}
        />
        <AssignedModal
          isModalOpen={isAssignedOpen}
          handleCancel={handleAssigned}
          handleOk={handleAssigned}
          assignedUsers={selectedWorkOrder?.assignedUserIds}
        />
      </Col>
    </Row>
  );
};

export default WorkOrders;
