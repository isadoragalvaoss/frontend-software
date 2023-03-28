import {
  Button,
  Col,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
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

import { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TableTitle } from "./WorkOrders.styles";
const { Title } = Typography;

export const WorkOrders = (): JSX.Element => {
  const {
    data: dataWorkOrder,
    error,
    isLoading,
    isError,
    isFetching,
    setData,
    newWorkOrderData,
  } = useWorkOrdersContext();

  const [isCheckListOpen, setIsCheckListOpen] = useState(false);
  const [isAssignedOpen, setIsAssignedOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] =
    useState<IWorkOrders | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const hasNewWorkOrderData = newWorkOrderData && newWorkOrderData.length > 0;
  const paginationTotal = hasNewWorkOrderData
    ? newWorkOrderData.length
    : dataWorkOrder?.data.length;

  const dataList = hasNewWorkOrderData
    ? newWorkOrderData
        .map((item, index) => ({
          ...item,
          key: index,
        }))
        .slice(start, end)
    : dataWorkOrder?.data
        .map((item, index) => ({
          ...item,
          key: index,
        }))
        .slice(start, end);
  const pagination = {
    current: currentPage,
    pageSize: itemsPerPage,
    total: paginationTotal,
    onChange: (page: number) => setCurrentPage(page),
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
          <Popconfirm
            title="Delete the workOrder"
            description="Are you sure to delete this workOrder?"
            onConfirm={() => confirm(workOrder)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function removeItemById(
    arr: IWorkOrders[],
    variables: DeleteWorkOrder
  ): IWorkOrders[] {
    return arr.filter((item) => item.id !== variables.id);
  }

  function updateItemById(
    arr: IWorkOrders[],
    item: IWorkOrders
  ): IWorkOrders[] {
    const index = arr.findIndex((currentItem) => currentItem.id === item.id);
    if (index !== -1) {
      const newArray = [...arr];
      newArray[index] = item;
      return newArray;
    }
    return arr;
  }

  const { mutate: mutateAddWorkOrder } = useMutation(
    ({ body }: CreateWorkOrder) => addWorkOrder({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewWorkOrderData)
          setData([...(dataWorkOrder?.data ?? []), data.data]);
        else {
          const newId =
            Math.max(...newWorkOrderData.map((item) => item.id)) + 1;
          const newItem = { ...data.data, id: newId };
          setData([...newWorkOrderData, newItem]);
        }
        toast.success("WorkOrder added!");
      },
    }
  );

  const { mutate: mutateUpdateWorkOrder } = useMutation(
    ({ body, id }: UpdateWorkOrder) => updateWorkOrder({ body, id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewWorkOrderData && dataWorkOrder) {
          const newData = updateItemById(dataWorkOrder?.data, data.data);
          setData(newData);
        } else {
          if (newWorkOrderData) {
            const newData = updateItemById(newWorkOrderData, data.data);
            setData(newData);
          }
        }
        toast.success("WorkOrder updated!");
      },
      onError: (error: AxiosError, variables) => {
        const data: IWorkOrders = {
          title: variables.body.title,
          id: variables.id,
          assetId: variables.body.assetId,
          assignedUserIds: variables.body.assignedUserIds,
          checklist: variables.body.checklist,
          description: variables.body.description,
          priority: variables.body.priority,
          status: variables.body.status,
        };
        if (newWorkOrderData) {
          setData(updateItemById(newWorkOrderData, data));
          toast.success("WorkOrder updated!");
        } else toast.error(`${error.message}`);
      },
    }
  );

  const { mutate: mutateRemoveWorkOrder } = useMutation(
    ({ id }: DeleteWorkOrder) => deleteWorkOrder({ id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewWorkOrderData && dataWorkOrder)
          setData(removeItemById(dataWorkOrder?.data, variables));
        else {
          if (newWorkOrderData) {
            setData(removeItemById(newWorkOrderData, variables));
          }
        }
        toast.success("WorkOrder deleted!");
      },
      onError: (error: AxiosError, variables) => {
        if (newWorkOrderData) {
          setData(removeItemById(newWorkOrderData, variables));
          if (currentPage > 1) setCurrentPage(currentPage - 1);
          toast.success("WorkOrder deleted!");
        } else toast.error(`${error.message}`);
      },
    }
  );

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

  const confirm = (item: IWorkOrders) => {
    mutateRemoveWorkOrder({ id: item.id });
  };

  function renderWorkOrders() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataWorkOrder) {
      return <Skeleton title={false} loading={isLoading} active></Skeleton>;
    } else {
      return (
        <Row>
          <Col span={24}>
            <Table
              dataSource={dataList}
              columns={columns}
              pagination={pagination}
              title={() => (
                <TableTitle>
                  <Title level={2}>Work Orders</Title>
                  <Button onClick={() => setIsFormOpen(!isFormOpen)}>
                    New
                  </Button>
                </TableTitle>
              )}
              scroll={{ x: "min-content" }}
            />
          </Col>
        </Row>
      );
    }
  }
  return (
    <div>
      {renderWorkOrders()}
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
      <FormWorkOrdersModal
        addWorkOrder={mutateAddWorkOrder}
        updateWorkOrder={mutateUpdateWorkOrder}
        isModalVisible={isFormOpen}
        selectedItem={selectedWorkOrder}
        setIsModalVisible={() => setIsFormOpen(!isFormOpen)}
        onCancel={handleForm}
      />
      <ToastContainer />
    </div>
  );
};

export default WorkOrders;
