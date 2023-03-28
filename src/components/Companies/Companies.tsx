import { Button, Card, List, Popconfirm, Skeleton, Typography } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    data: dataCompany,
    error,
    isLoading,
    isError,
    isFetching,
    setData,
    newCompanyData,
  } = useCompaniesContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ICompanies | null>(null);

  const itemsPerPage = 1;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const hasNewCompanyData = newCompanyData && newCompanyData.length > 0;
  const paginationTotal = hasNewCompanyData
    ? newCompanyData.length
    : dataCompany?.data.length;

  const dataList = hasNewCompanyData
    ? newCompanyData.slice(start, end)
    : dataCompany?.data.slice(start, end);
  const pagination = {
    current: currentPage,
    pageSize: itemsPerPage,
    total: paginationTotal,
    onChange: (page: number) => setCurrentPage(page),
  };

  function removeItemById(
    arr: ICompanies[],
    variables: DeleteCompany
  ): ICompanies[] {
    return arr.filter((item) => item.id !== variables.id);
  }

  function updateItemById(arr: ICompanies[], item: ICompanies): ICompanies[] {
    const index = arr.findIndex((currentItem) => currentItem.id === item.id);
    if (index !== -1) {
      const newArray = [...arr];
      newArray[index] = item;
      return newArray;
    }
    return arr;
  }
  const { mutate: mutateAddCompany } = useMutation(
    ({ body }: CreateCompany) => addCompany({ body }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewCompanyData)
          setData([...(dataCompany?.data ?? []), data.data]);
        else {
          const newId = Math.max(...newCompanyData.map((item) => item.id)) + 1;
          const newItem = { ...data.data, id: newId };
          setData([...newCompanyData, newItem]);
        }
        toast.success("Company added!");
      },
    }
  );

  const { mutate: mutateUpdateCompany } = useMutation(
    ({ body, id }: UpdateCompany) => updateCompany({ body, id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewCompanyData && dataCompany) {
          const newData = updateItemById(dataCompany?.data, data.data);
          setData(newData);
        } else {
          if (newCompanyData) {
            const newData = updateItemById(newCompanyData, data.data);
            setData(newData);
          }
        }
        toast.success("Company updated!");
      },
      onError: (error: AxiosError, variables) => {
        const data: ICompanies = {
          name: variables.body.name,
          id: variables.id,
        };
        if (newCompanyData) {
          setData(updateItemById(newCompanyData, data));
          toast.success("Company updated!");
        } else toast.error(`${error.message}`);
      },
    }
  );

  const { mutate: mutateRemoveCompany } = useMutation(
    ({ id }: DeleteCompany) => deleteCompany({ id }),
    {
      onSuccess: (data, variables) => {
        if (!hasNewCompanyData && dataCompany)
          setData(removeItemById(dataCompany?.data, variables));
        else {
          if (newCompanyData) {
            setData(removeItemById(newCompanyData, variables));
          }
        }
        toast.success("Company deleted!");
      },
      onError: (error: AxiosError, variables) => {
        if (newCompanyData) {
          setData(removeItemById(newCompanyData, variables));
          if (currentPage > 1) setCurrentPage(currentPage - 1);
          toast.success("Company deleted!");
        } else toast.error(`${error.message}`);
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

  const confirm = (item: ICompanies) => {
    mutateRemoveCompany({ id: item.id });
  };

  function renderCompanies() {
    if (isError && error) {
      return <div>Error</div>;
    }
    if (isLoading || isFetching || !dataCompany) {
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
                  <Popconfirm
                    title="Delete the company"
                    description="Are you sure to delete this company?"
                    onConfirm={() => confirm(item)}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                    disabled={item.id === 1}
                  >
                    <Button disabled={item.id === 1}>Delete</Button>
                  </Popconfirm>,
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
      <ToastContainer />
    </div>
  );
};

export default Companies;
