import { AxiosResponse } from "axios";
import {
  ENDPOINT_ASSETS,
  ENDPOINT_COMPANIES,
  ENDPOINT_UNITS,
  ENDPOINT_USERS,
  ENDPOINT_WorkOrders,
} from "../consts/endpoints";

import api from "./api";

interface IUsers {
  id?: number;
  signal?: AbortSignal;
}

export const getUsers = async ({
  id,
  signal,
}: IUsers): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_USERS}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getAssets = async ({
  id,
  signal,
}: IUsers): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_ASSETS}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getWorkOrders = async ({
  id,
  signal,
}: IUsers): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_WorkOrders}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getCompanies = async ({
  id,
  signal,
}: IUsers): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_COMPANIES}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getUnits = async ({
  id,
  signal,
}: IUsers): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_UNITS}`,
    config: {
      params: {
        signal,
      },
    },
  });
