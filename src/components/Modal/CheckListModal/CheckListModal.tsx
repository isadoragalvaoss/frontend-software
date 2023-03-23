import { Modal, Timeline } from "antd";
import { ICheckList } from "../../../models/workorders";

interface ICheckListProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  checkList: ICheckList[] | undefined;
}
export const CheckListModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  checkList,
}: ICheckListProps): JSX.Element => {
  return (
    <Modal
      title="CheckList"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Timeline mode="left" style={{ paddingTop: 15 }}>
        {checkList &&
          checkList.map((item, index) => (
            <Timeline.Item
              key={index}
              color={item.completed ? "green" : "gray"}
            >
              {item.task}
            </Timeline.Item>
          ))}
      </Timeline>
    </Modal>
  );
};

export default CheckListModal;
