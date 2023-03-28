import { Button, Form, Input, Modal, Select } from "antd";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { UseMutateFunction } from "react-query";
import { useCompaniesContext } from "../../../../contexts/CompaniesContext";
import { useUnitsContext } from "../../../../contexts/UnitsContext";
import { IUnits } from "../../../../models/units";
import { CreateUser, IUsers, UpdateUser } from "../../../../models/users";
const { Option } = Select;

interface ModalProps {
  selectedItem: IUsers | null;
  addUser: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    CreateUser,
    unknown
  >;
  updateUser: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    UpdateUser,
    unknown
  >;
  setIsModalVisible: (prevState: boolean) => void;
  onCancel: () => void;
  isModalVisible: boolean;
}
export const FormModal = ({
  addUser,
  selectedItem,
  setIsModalVisible,
  isModalVisible,
  onCancel,
  updateUser,
}: ModalProps): JSX.Element => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      console.log(values);
      if (!selectedItem) {
        addUser({
          body: values,
        });
      } else {
        updateUser({
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
      email: selectedItem?.email,
      unitId: selectedItem?.unitId,
    });
  }, [form, selectedItem]);

  const { newCompanyData, data: CompaniesData } = useCompaniesContext();
  const companyData =
    newCompanyData && newCompanyData?.length > 0
      ? newCompanyData
      : CompaniesData?.data;
  const { newUnitData, data: UnitsData } = useUnitsContext();
  const unitData =
    newUnitData && newUnitData?.length > 0 ? newUnitData : UnitsData?.data;

  return (
    <Modal
      title="Create User"
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="companyId"
          label="Company ID"
          rules={[{ required: true }]}
        >
          <Select>
            {companyData &&
              companyData.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="unitId" label="Unit ID" rules={[{ required: true }]}>
          <Select>
            {unitData &&
              unitData.map((item: IUnits) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleCreate} loading={loading} type="primary">
            {selectedItem ? "Edit" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default FormModal;
