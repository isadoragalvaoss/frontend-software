import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { useEffect, useState } from "react";
import { useCompaniesContext } from "../../../../contexts/CompaniesContext";
import { useUnitsContext } from "../../../../contexts/UnitsContext";
import { useUserContext } from "../../../../contexts/UserContext";
import { AssetModal } from "../../../../models/assets";
import { IUnits } from "../../../../models/units";
import { IUsers } from "../../../../models/users";
import {
  ContainerFlex,
  SelectItem,
  SpaceHealthHistory,
} from "./FormAssetModal.styles";

const { Option } = Select;

export const FormAssetModal = ({
  addAsset,
  selectedItem,
  setIsModalVisible,
  isModalVisible,
  onCancel,
  updateAsset,
}: AssetModal): JSX.Element => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string[]>([]);

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    const string = new Date(dateString.toString()).toISOString();
    setDate([...date, string]);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const healthHistory = await form.getFieldValue(`healthHistory`);

      const updatedHealthHistory = healthHistory.map(
        (item: any, index: any) => {
          return {
            ...item,
            timestamp: date[index],
          };
        }
      );
      form.setFieldValue(`healthHistory`, updatedHealthHistory);

      const today = new Date().toISOString();
      form.setFieldValue(["metrics", "lastUptimeAt"], today);
      const values = await form.validateFields();
      if (!selectedItem) {
        addAsset({
          body: values,
        });
      } else {
        updateAsset({
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
      assignedUserIds: selectedItem?.assignedUserIds,
      companyId: selectedItem?.companyId,
      //healthHistory: selectedItem?.healthHistory,
      healthscore: selectedItem?.healthscore,
      image: selectedItem?.image,
      metrics: {
        lastUptimeAt: selectedItem?.metrics.lastUptimeAt,
        totalCollectsUptime: selectedItem?.metrics.totalCollectsUptime,
        totalUptime: selectedItem?.metrics.totalUptime,
      },
      model: selectedItem?.model,
      sensors: selectedItem?.sensors,
      specifications: {
        maxTemp: selectedItem?.specifications.maxTemp,
        power: selectedItem?.specifications.power,
        rpm: selectedItem?.specifications.rpm,
      },
      status: selectedItem?.status,
      unitId: selectedItem?.unitId,
    });
  }, [form, selectedItem]);

  const { newUserData, data: UsersData } = useUserContext();
  const userData =
    newUserData && newUserData?.length > 0 ? newUserData : UsersData?.data;
  const { newUnitData, data: UnitsData } = useUnitsContext();
  const unitData =
    newUnitData && newUnitData?.length > 0 ? newUnitData : UnitsData?.data;
  const { newCompanyData, data: CompaniesData } = useCompaniesContext();
  const companyData =
    newCompanyData && newCompanyData?.length > 0
      ? newCompanyData
      : CompaniesData?.data;

  const status = [
    { name: "In Alert", id: "inAlert" },
    { name: "In Operation", id: "inOperation" },
    { name: "Planned Stop", id: "plannedStop" },
    { name: "Unplanned Stop", id: "unplannedStop" },
    { name: "In Downtime", id: "inDowntime" },
  ];

  const model = [
    { name: "Motor", id: "motor" },
    { name: "Fan", id: "fan" },
  ];

  return (
    <Modal
      title="Create Asset"
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
      width="70%"
    >
      <Form form={form} layout="horizontal" style={{ overflow: "auto" }}>
        <Form.Item rules={[{ required: true }]} name="name" label="Name">
          <Input />
        </Form.Item>

        <Form.Item rules={[{ required: true }]} name="image" label="Image Link">
          <Input />
        </Form.Item>

        <ContainerFlex>
          <SelectItem rules={[{ required: true }]} label="Model" name="model">
            <Select>
              {model.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </SelectItem>
          <Form.Item
            rules={[{ required: true }]}
            name={["sensors", 0]}
            label="Sensors"
          >
            <Input />
          </Form.Item>

          <Form.Item
            rules={[{ required: true }]}
            name="healthscore"
            label="Health Score"
          >
            <InputNumber />
          </Form.Item>
        </ContainerFlex>

        <Form.Item name="specifications" label="Specifications">
          <Input.Group>
            <ContainerFlex>
              <Form.Item
                rules={[{ required: true }]}
                name={["specifications", "maxTemp"]}
                label="Max Temperature"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name={["specifications", "rpm"]}
                label="RPM"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name={["specifications", "power"]}
                label="Power"
              >
                <InputNumber />
              </Form.Item>
            </ContainerFlex>
          </Input.Group>
        </Form.Item>
        <Form.Item name="metrics" label="Metrics">
          <Input.Group>
            <ContainerFlex>
              <Form.Item
                rules={[{ required: true }]}
                name={["metrics", "totalCollectsUptime"]}
                label="Total Collects Uptime"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name={["metrics", "totalUptime"]}
                label="Total Uptime"
              >
                <InputNumber />
              </Form.Item>
            </ContainerFlex>
          </Input.Group>
        </Form.Item>

        <ContainerFlex>
          <SelectItem
            rules={[{ required: true }]}
            label="Assigned Users"
            name="assignedUserIds"
            large
          >
            <Select mode="multiple">
              {userData &&
                userData.map((item: IUsers) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </SelectItem>
          <SelectItem
            rules={[{ required: true }]}
            label="Company"
            name="companyId"
            large
          >
            <Select>
              {companyData &&
                companyData.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </SelectItem>
        </ContainerFlex>
        <ContainerFlex>
          <SelectItem
            rules={[{ required: true }]}
            label="Status"
            name="status"
            large
          >
            <Select>
              {status.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </SelectItem>
          <SelectItem
            rules={[{ required: true }]}
            label="Unit"
            name="unitId"
            large
          >
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
          </SelectItem>
        </ContainerFlex>
        <Form.List name="healthHistory">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <SpaceHealthHistory
                  key={`healthHistory-${field.key}-${index}`}
                  align="baseline"
                >
                  <SelectItem
                    {...field}
                    name={[field.name, "status"]}
                    key={`${field.key}-completed`}
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {status.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </SelectItem>
                  <Form.Item
                    {...field}
                    name={[field.name, "timestamp"]}
                    rules={[{ required: true, message: "'task' is required" }]}
                    style={{ margin: 0 }}
                    key={`${field.key}-task`}
                  >
                    <DatePicker showTime onChange={onChange} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </SpaceHealthHistory>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add health history
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Button onClick={handleCreate} loading={loading} type="primary">
          {selectedItem ? "Edit" : "Create"}
        </Button>
      </Form>
    </Modal>
  );
};
export default FormAssetModal;
