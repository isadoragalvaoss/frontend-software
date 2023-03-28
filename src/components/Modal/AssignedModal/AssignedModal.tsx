import { List, Modal } from "antd";
import { useUserContext } from "../../../contexts/UserContext";

interface IAssignedModal {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  assignedUsers: number[] | undefined;
}
export const AssignedModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  assignedUsers,
}: IAssignedModal): JSX.Element => {
  const { newUserData, data: UsersData } = useUserContext();
  const userData =
    newUserData && newUserData?.length > 0 ? newUserData : UsersData?.data;
  return (
    <Modal
      title="Assigned"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <List
        size="small"
        bordered
        dataSource={
          userData &&
          userData.filter(
            (user) => assignedUsers && assignedUsers.includes(user.id)
          )
        }
        renderItem={(item) => (
          <List.Item>
            {item.name} - {item.email}
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default AssignedModal;
