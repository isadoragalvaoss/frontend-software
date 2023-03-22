import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IRequest {
  url: string;
  config?: AxiosRequestConfig;
  body?: unknown;
}

export const axiosInstance = axios.create();

const api = {
  get: ({ url, config }: IRequest): Promise<AxiosResponse> =>
    axiosInstance.get(url, config),

  post: ({ url, body, config }: IRequest): Promise<AxiosResponse> =>
    axiosInstance.post(url, body, config),

  delete: ({ url, config }: IRequest): Promise<AxiosResponse> =>
    axiosInstance.delete(url, config),

  put: ({ url, body, config }: IRequest): Promise<AxiosResponse> =>
    axiosInstance.put(url, body, config),

  patch: ({ url, body, config }: IRequest): Promise<AxiosResponse> =>
    axiosInstance.patch(url, body, config),
};

export default api;
