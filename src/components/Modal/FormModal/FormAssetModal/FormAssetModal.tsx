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
import { ICompanies } from "../../../../models/companies";
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

  const users = useUserContext();
  const units = useUnitsContext();
  const companies = useCompaniesContext();

  const status = [
    { name: "In Alert", id: "inAlert" },
    { name: "In Operation", id: "inOperation" },
    { name: "Planned Stop", id: "plannedStop" },
    { name: "Unplanned Stop", id: "unplannedStop" },
    { name: "In Downtime", id: "inDowntime" },
  ];

  return (
    <Modal
      title="Create Company"
      open={isModalVisible}
      onCancel={onCancel}
      footer={null}
      width="50%"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>

        <Form.Item name="image" label="Image Link">
          <Input />
        </Form.Item>

        <ContainerFlex>
          <Form.Item name="model" label="Model">
            <Input />
          </Form.Item>
          <Form.Item name={["sensors", 0]} label="sensors">
            <Input />
          </Form.Item>

          <Form.Item name="healthscore" label="Health Score">
            <InputNumber />
          </Form.Item>
        </ContainerFlex>

        <Form.Item name="specifications" label="Specifications">
          <Input.Group>
            <ContainerFlex>
              <Form.Item
                name={["specifications", "maxTemp"]}
                label="Max Temperature"
              >
                <InputNumber placeholder="Input 1" />
              </Form.Item>
              <Form.Item name={["specifications", "rpm"]} label="RPM">
                <InputNumber placeholder="Input 2" />
              </Form.Item>
              <Form.Item name={["specifications", "power"]} label="Power">
                <InputNumber placeholder="Input 3" />
              </Form.Item>
            </ContainerFlex>
          </Input.Group>
        </Form.Item>
        <Form.Item name="metrics" label="metrics">
          <Input.Group>
            <ContainerFlex>
              <Form.Item
                name={["metrics", "lastUptimeAt"]}
                label="Last Uptime At"
              >
                <Input placeholder="Input 1" />
              </Form.Item>
              <Form.Item
                name={["metrics", "totalCollectsUptime"]}
                label="Total Collects Uptime"
              >
                <InputNumber placeholder="Input 2" />
              </Form.Item>
              <Form.Item name={["metrics", "totalUptime"]} label="Total Uptime">
                <InputNumber placeholder="Input 3" />
              </Form.Item>
            </ContainerFlex>
          </Input.Group>
        </Form.Item>

        <ContainerFlex>
          <SelectItem label="Assigned Users" name="assignedUserIds">
            <Select mode="multiple">
              {users?.data &&
                users.data.data.map((item: IUsers) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </SelectItem>
          <SelectItem label="Company" name="companyId">
            <Select>
              {companies?.data &&
                companies.data.data.map((item: ICompanies) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </SelectItem>
        </ContainerFlex>
        <ContainerFlex>
          <SelectItem label="Status" name="status">
            <Select>
              {status.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </SelectItem>
          <SelectItem label="Unit" name="unitId">
            <Select>
              {units?.data &&
                units.data.data.map((item: IUnits) => {
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
                    rules={[{ required: true, message: "Missing task" }]}
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
