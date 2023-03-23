import { AxiosResponse } from "axios";
import { ENDPOINT_COMPANIES } from "../../consts/endpoints";
import {
  CreateCompany,
  DeleteCompany,
  GetCompany,
  UpdateCompany,
} from "../../models/companies";
import api from "../api";

export const getCompanies = async ({
  signal,
}: GetCompany): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_COMPANIES}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const getOneCompany = async ({
  id,
  signal,
}: GetCompany): Promise<AxiosResponse> =>
  api.get({
    url: `${ENDPOINT_COMPANIES}/${id}`,
    config: {
      params: {
        signal,
      },
    },
  });

export const addCompany = async ({
  body,
}: CreateCompany): Promise<AxiosResponse> =>
  api.post({
    url: `${ENDPOINT_COMPANIES}`,
    body,
  });

export const updateCompany = async ({
  body,
  id,
}: UpdateCompany): Promise<AxiosResponse> =>
  api.put({
    url: `${ENDPOINT_COMPANIES}/${id}`,
    body,
  });

export const deleteCompany = async ({
  id,
}: DeleteCompany): Promise<AxiosResponse> =>
  api.delete({
    url: `${ENDPOINT_COMPANIES}/${id}`,
  });
