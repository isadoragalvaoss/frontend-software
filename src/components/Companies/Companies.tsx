import { Button, Card, List, Skeleton, Typography } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import {
  addCompany,
  deleteCompany,
  updateCompany,
} from "../../api/services/companies";
import { useCompaniesContext } from "../../contexts/CompaniesContext";
import {
  CreateCompany,
  DeleteCompany,
  ICompanies,
  UpdateCompany,
} from "../../models/companies";
import FormCompanyModal from "../Modal/FormModal/FormCompanyModal";
import { CardTitle } from "./Companies.styles";
const { Title } = Typography;

const Companies = (): JSX.Element => {
  const {
    data: dataUser,
    error,
    isLoading,
    isError,
    isFetching,
  } = useCompaniesContext();
  const [dataTotal, setDataTotal] = useState<ICompanies[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const hasDataTotal = dataTotal?.length !== 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ICompanies | null>(null);

  const itemsPerPage = 1;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const dataList = hasDataTotal
    ? dataTotal.slice(start, end)
    : dataUser?.data.slice(start, end);
  const pagination = {
    current: currentPage,
    pageSize: itemsPerPage,
    total: hasDataTotal ? dataTotal.length : dataUser?.data.length,
    onChange: (page: number) => setCurrentPage(page),
  };

  const { mutate: mutateAddCompany } = useMutation(
    ({ body }: CreateCompany) => addCompany({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasDataTotal) setDataTotal([...(dataUser?.data ?? []), data.data]);
        else setDataTotal([...dataTotal, data.data]);
      },
    }
  );

  const { mutate: mutateUpdateCompany } = useMutation(
    ({ body, id }: UpdateCompany) => updateCompany({ body, id }),
    {
      onSuccess: (data, variables) => {
        function updateItemById(
          arr: ICompanies[],
          item: ICompanies
        ): ICompanies[] {
          return arr.map((currentItem) => {
            if (currentItem.id === item.id) {
              return item;
            }
            return currentItem;
          });
        }

        if (!hasDataTotal && dataUser) {
          const newData = updateItemById(dataUser?.data, data.data);
          setDataTotal(newData);
        } else {
          const newData = updateItemById(dataTotal, data.data);
          setDataTotal(newData);
        }
      },
    }
  );

  const { mutate: mutateRemoveUser } = useMutation(
    ({ id }: DeleteCompany) => deleteCompany({ id }),
    {
      onSuccess: (data, variables) => {
        function removeItemById(arr: ICompanies[]): ICompanies[] {
          return arr.filter((item) => item.id !== variables.id);
        }

        if (!hasDataTotal && dataUser)
          setDataTotal(removeItemById(dataUser?.data));
        else setDataTotal(removeItemById(dataTotal));
      },
    }
  );

  const showModal = (item: ICompanies | null) => {
    setSelectedItem(item ?? null);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  function renderCompanies() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataUser) {
      return <Skeleton title={false} loading={isLoading} active></Skeleton>;
    } else {
      return (
        <Card
          title={
            <CardTitle>
              <Title level={3}>Companies</Title>
              <Button onClick={() => showModal(null)}>New</Button>
            </CardTitle>
          }
        >
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={dataList}
            pagination={pagination}
            style={{ overflow: "auto" }}
            renderItem={(item: ICompanies) => (
              <List.Item
                actions={[
                  <Button onClick={() => showModal(item)}>Edit</Button>,
                  <Button onClick={() => mutateRemoveUser({ id: item.id })}>
                    Delete
                  </Button>,
                ]}
              >
                <List.Item.Meta title={item.name} />
              </List.Item>
            )}
          />
        </Card>
      );
    }
  }

  return (
    <div>
      {renderCompanies()}
      <FormCompanyModal
        addCompany={mutateAddCompany}
        updateCompany={mutateUpdateCompany}
        isModalVisible={isModalVisible}
        selectedItem={selectedItem}
        setIsModalVisible={() => setIsModalVisible(!isModalVisible)}
        onCancel={hideModal}
      />
    </div>
  );
};

export default Companies;
