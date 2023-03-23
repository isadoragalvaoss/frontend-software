import { AxiosResponse } from "axios";
import { ENDPOINT_USERS } from "../../consts/endpoints";
import {
  CreateUser,
  DeleteUser,
  GetUser,
  UpdateUser,
} from "../../models/users";
import api from "../api";

export const getUsers = async ({ signal }: GetUser): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_USERS}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getOneUser = async ({
  id,
  signal,
}: GetUser): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_USERS}/${id}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const addUser = async ({ body }: CreateUser): Promise<AxiosResponse> =>
  api.post({
    url: `${ENDPOINT_USERS}`,
    body,
  });

export const updateUser = async ({
  body,
  id,
}: UpdateUser): Promise<AxiosResponse> =>
  api.put({
    url: `${ENDPOINT_USERS}/${id}`,
    body,
  });

export const deleteUser = async ({ id }: DeleteUser): Promise<AxiosResponse> =>
  api.delete({
    url: `${ENDPOINT_USERS}/${id}`,
  });
