import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { CompanyModal } from "../../../../models/companies";

export const FormCompanyModal = ({
  addCompany,
  selectedItem,
  setIsModalVisible,
  isModalVisible,
  onCancel,
  updateCompany,
}: CompanyModal): JSX.Element => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      if (!selectedItem) {
        addCompany({
          body: values,
        });
      } else {
        updateCompany({
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
      name: selectedItem?.name,
    });
  }, [form, selectedItem]);

  return (
    <Modal
      title="Create Company"
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button onClick={handleCreate} loading={loading} type="primary">
          {selectedItem ? "Edit" : "Create"}
        </Button>
      </Form>
    </Modal>
  );
};
export default FormCompanyModal;
