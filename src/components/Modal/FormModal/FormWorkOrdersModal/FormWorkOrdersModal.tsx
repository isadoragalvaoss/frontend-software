import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Modal, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useAssetsContext } from "../../../../contexts/AssetsContext";
import { useUserContext } from "../../../../contexts/UserContext";
import { IAssets } from "../../../../models/assets";
import { IUsers } from "../../../../models/users";
import { WorkOrderModal } from "../../../../models/workorders";

const { Option } = Select;

export const FormWorkOrdersModal = ({
  addWorkOrder,
  selectedItem,
  setIsModalVisible,
  isModalVisible,
  onCancel,
  updateWorkOrder,
}: WorkOrderModal): JSX.Element => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      if (!selectedItem) {
        addWorkOrder({
          body: values,
        });
      } else {
        updateWorkOrder({
          body: values,
          id: selectedItem.id,
        });
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      title: selectedItem?.title,
      assetId: selectedItem?.assetId,
      assignedUserIds: selectedItem?.assignedUserIds,
      checklist: selectedItem?.checklist,
      description: selectedItem?.description,
      priority: selectedItem?.priority,
      status: selectedItem?.status,
    });
  }, [form, selectedItem]);

  const assets = useAssetsContext();
  const { newUserData, data: UsersData } = useUserContext();
  const userData =
    newUserData && newUserData?.length > 0 ? newUserData : UsersData?.data;
  return (
    <Modal
      open={isModalVisible}
      title="Repair Form"
      onOk={handleCreate}
      onCancel={onCancel}
    >
      <Form form={form} layout="horizontal">
        <Form.Item rules={[{ required: true }]} label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="Asset" name="assetId">
          <Select>
            {assets?.data &&
              assets.data.data.map((item: IAssets) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Assigned Users"
          name="assignedUserIds"
        >
          <Select mode="multiple">
            {userData &&
              userData.map((item: IUsers) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.List name="checklist">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space
                  key={`checklist-${field.key}-${index}`}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...field}
                    name={[field.name, "completed"]}
                    noStyle
                    valuePropName="checked"
                    initialValue={false}
                    key={`${field.key}-completed`}
                  >
                    <Checkbox />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, "task"]}
                    rules={[{ required: true, message: "'task' is required" }]}
                    style={{ margin: 0 }}
                    key={`${field.key}-task`}
                  >
                    <Input placeholder="Enter task" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add task
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          rules={[{ required: true }]}
          label="Description"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          rules={[{ required: true }]}
          label="Priority"
          name="priority"
        >
          <Select>
            <Option value="high">High</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item rules={[{ required: true }]} label="Status" name="status">
          <Select>
            <Option value="completed">Completed</Option>
            <Option value="in progress">In Progress</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default FormWorkOrdersModal;
