import { AxiosResponse } from "axios";
import { ENDPOINT_ASSETS } from "../../consts/endpoints";
import {
  CreateAsset,
  DeleteAsset,
  GetAsset,
  UpdateAsset,
} from "../../models/assets";
import api from "../api";

export const getAssets = async ({ signal }: GetAsset): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_ASSETS}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getOneAsset = async ({
  id,
  signal,
}: GetAsset): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_ASSETS}/${id}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const addAsset = async ({ body }: CreateAsset): Promise<AxiosResponse> =>
  api.post({
    url: `${ENDPOINT_ASSETS}`,
    body,
  });

export const updateAsset = async ({
  body,
  id,
}: UpdateAsset): Promise<AxiosResponse> =>
  api.put({
    url: `${ENDPOINT_ASSETS}/${id}`,
    body,
  });

export const deleteAsset = async ({
  id,
}: DeleteAsset): Promise<AxiosResponse> =>
  api.delete({
    url: `${ENDPOINT_ASSETS}/${id}`,
  });
