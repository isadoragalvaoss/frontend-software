import { AxiosResponse } from "axios";
import { ENDPOINT_WORKORDERS } from "../../consts/endpoints";
import {
  CreateWorkOrder,
  DeleteWorkOrder,
  GetWorkOrder,
  UpdateWorkOrder,
} from "../../models/workorders";
import api from "../api";

export const getWorkOrders = async ({
  signal,
}: GetWorkOrder): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_WORKORDERS}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getOneWorkOrder = async ({
  id,
  signal,
}: GetWorkOrder): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_WORKORDERS}/${id}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const addWorkOrder = async ({
  body,
}: CreateWorkOrder): Promise<AxiosResponse> =>
  api.post({
    url: `${ENDPOINT_WORKORDERS}`,
    body,
  });

export const updateWorkOrder = async ({
  body,
  id,
}: UpdateWorkOrder): Promise<AxiosResponse> =>
  api.put({
    url: `${ENDPOINT_WORKORDERS}/${id}`,
    body,
  });

export const deleteWorkOrder = async ({
  id,
}: DeleteWorkOrder): Promise<AxiosResponse> =>
  api.delete({
    url: `${ENDPOINT_WORKORDERS}/${id}`,
  });
