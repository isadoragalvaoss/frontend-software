import { AxiosResponse } from "axios";
import { ENDPOINT_UNITS } from "../../consts/endpoints";
import {
  CreateUnit,
  DeleteUnit,
  GetUnit,
  UpdateUnit,
} from "../../models/units";
import api from "../api";

export const getUnits = async ({ signal }: GetUnit): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_UNITS}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getOneUnit = async ({
  id,
  signal,
}: GetUnit): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_UNITS}/${id}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const addUnit = async ({ body }: CreateUnit): Promise<AxiosResponse> =>
  api.post({
    url: `${ENDPOINT_UNITS}`,
    body,
  });

export const updateUnit = async ({
  body,
  id,
}: UpdateUnit): Promise<AxiosResponse> =>
  api.put({
    url: `${ENDPOINT_UNITS}/${id}`,
    body,
  });

export const deleteUnit = async ({ id }: DeleteUnit): Promise<AxiosResponse> =>
  api.delete({
    url: `${ENDPOINT_UNITS}/${id}`,
  });
