import { Modal } from "antd";
import { GRAY, GREEN } from "../../../consts/colors";
import { ICheckList } from "../../../models/workorders";
import { TimelineContent } from "./CheckListModal.styles";

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
  function createChecklistObjects() {
    return (
      checkList &&
      checkList.map((item, index) => {
        const color = item.completed ? GREEN : GRAY;
        return { children: item.task, color, key: index };
      })
    );
  }

  const items = createChecklistObjects();
  return (
    <Modal
      title="CheckList"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <TimelineContent mode="left" items={items} />
    </Modal>
  );
};

export default CheckListModal;
