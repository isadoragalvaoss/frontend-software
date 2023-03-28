import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useCompaniesContext } from "../../../../contexts/CompaniesContext";
import { ICompanies } from "../../../../models/companies";
import { UnitModal } from "../../../../models/units";
const { Option } = Select;

export const FormCompanyModal = ({
  addUnit,
  selectedItem,
  setIsModalVisible,
  isModalVisible,
  onCancel,
  updateUnit,
}: UnitModal): JSX.Element => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      if (!selectedItem) {
        addUnit({
          body: values,
        });
      } else {
        updateUnit({
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
      companyId: selectedItem?.companyId,
    });
  }, [form, selectedItem]);

  const { data: CompaniesData, newCompanyData } = useCompaniesContext();
  const companyData =
    newCompanyData && newCompanyData?.length > 0
      ? newCompanyData
      : CompaniesData?.data;

  return (
    <Modal
      title="Create Unit"
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="companyId"
          label="Company ID"
          rules={[{ required: true }]}
        >
          <Select>
            {companyData &&
              companyData.map((item: ICompanies) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Button onClick={handleCreate} loading={loading} type="primary">
          {selectedItem ? "Edit" : "Create"}
        </Button>
      </Form>
    </Modal>
  );
};
export default FormCompanyModal;
