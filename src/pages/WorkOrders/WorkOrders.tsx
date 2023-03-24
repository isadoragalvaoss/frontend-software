import { Button, Col, Row, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import {
  addWorkOrder,
  deleteWorkOrder,
  updateWorkOrder,
} from "../../api/services/workorders";
import AssignedModal from "../../components/Modal/AssignedModal";
import CheckListModal from "../../components/Modal/CheckListModal";
import FormWorkOrdersModal from "../../components/Modal/FormModal/FormWorkOrdersModal";
import { useWorkOrdersContext } from "../../contexts/WorkOrdersContext";
import {
  CreateWorkOrder,
  DeleteWorkOrder,
  IWorkOrders,
  UpdateWorkOrder,
} from "../../models/workorders";

export const WorkOrders = (): JSX.Element => {
  const { data: dataWorkOrders } = useWorkOrdersContext();
  const { Title } = Typography;

  const [isCheckListOpen, setIsCheckListOpen] = useState(false);
  const [isAssignedOpen, setIsAssignedOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dataTotal, setDataTotal] = useState<IWorkOrders[]>([]);
  const [selectedWorkOrder, setSelectedWorkOrder] =
    useState<IWorkOrders | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const hasDataTotal = dataTotal?.length !== 0;

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

  const showFormModal = (workOrder: IWorkOrders | null) => {
    setSelectedWorkOrder(workOrder);
    setIsFormOpen(!isFormOpen);
  };

  const handleForm = () => {
    setIsFormOpen(false);
    setSelectedWorkOrder(null);
  };

  const handlePriority = (priority: string) => {
    return (
      <>
        {priority === "high" ? (
          <Tag color="error">HIGH</Tag>
        ) : (
          <Tag color="blue">LOW</Tag>
        )}
      </>
    );
  };

  const handleStatus = (status: string) => {
    return (
      <>
        {status === "completed" ? (
          <Tag color="success">COMPLETED</Tag>
        ) : (
          <Tag color="processing">IN PROGRESS</Tag>
        )}
      </>
    );
  };
  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Priority",
      key: "priority",
      render: ({ priority }: IWorkOrders) => handlePriority(priority),
    },
    {
      title: "Status",
      key: "status",
      render: ({ status }: IWorkOrders) => handleStatus(status),
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
          <Button onClick={() => showFormModal(workOrder)}>Edit</Button>
          <Button
            onClick={() => {
              mutateRemoveWorkOrder({ id: workOrder.id });
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const { mutate: mutateAddWorkOrder } = useMutation(
    ({ body }: CreateWorkOrder) => addWorkOrder({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasDataTotal)
          setDataTotal([...(dataWorkOrders?.data ?? []), data.data]);
        else setDataTotal([...dataTotal, data.data]);
      },
    }
  );

  const { mutate: mutateUpdateWorkOrder } = useMutation(
    ({ body, id }: UpdateWorkOrder) => updateWorkOrder({ body, id }),
    {
      onSuccess: (data, variables) => {
        function updateItemById(
          arr: IWorkOrders[],
          item: IWorkOrders
        ): IWorkOrders[] {
          return arr.map((currentItem) => {
            if (currentItem.id === item.id) {
              return item;
            }
            return currentItem;
          });
        }

        if (!hasDataTotal && dataWorkOrders) {
          const newData = updateItemById(dataWorkOrders?.data, data.data);
          setDataTotal(newData);
        } else {
          const newData = updateItemById(dataTotal, data.data);
          setDataTotal(newData);
        }
      },
    }
  );

  const { mutate: mutateRemoveWorkOrder } = useMutation(
    ({ id }: DeleteWorkOrder) => deleteWorkOrder({ id }),
    {
      onSuccess: (data, variables) => {
        function removeItemById(arr: IWorkOrders[]): IWorkOrders[] {
          return arr.filter((item) => item.id !== variables.id);
        }

        if (!hasDataTotal && dataWorkOrders)
          setDataTotal(removeItemById(dataWorkOrders?.data));
        else setDataTotal(removeItemById(dataTotal));
      },
    }
  );

  const itemsPerPage = 4;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return (
    <Row>
      <Col span={24}>
        <Table
          dataSource={
            hasDataTotal
              ? dataTotal.slice(start, end)
              : dataWorkOrders?.data.slice(start, end)
          }
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: hasDataTotal
              ? dataTotal.length
              : dataWorkOrders?.data.length,
            onChange: (page: number) => setCurrentPage(page),
          }}
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
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>Form</Button>
        <FormWorkOrdersModal
          addWorkOrder={mutateAddWorkOrder}
          updateWorkOrder={mutateUpdateWorkOrder}
          isModalVisible={isFormOpen}
          selectedItem={selectedWorkOrder}
          setIsModalVisible={() => setIsFormOpen(!isFormOpen)}
          onCancel={handleForm}
        />
      </Col>
    </Row>
  );
};

export default WorkOrders;
