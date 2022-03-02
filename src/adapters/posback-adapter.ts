import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from './environmentConfigs';
import store, { useAppDispatch } from '../store/store';
import { ApiError } from '../models/api-error-model';
import { ContentType, ERROR_CODE } from '../utils/enum/common-enum';
import { refreshToken } from './keycloak-adapter';
import { logout } from '../store/slices/authSlice';
import { getSessionId, getAccessToken } from '../store/sessionStore';

const defaultForJSON = ContentType.JSON;
let contentType: string;
// const instance = (contentType: string) => {
const instance = axios.create({
  baseURL: env.backEnd.url,
  timeout: env.backEnd.timeout,
  headers: {
    'Content-Type': defaultForJSON,
  },
});

instance.interceptors.request.use(function (config: AxiosRequestConfig) {
  const token = getAccessToken();
  const sessionState = getSessionId();
  config.headers.common['x-trace'] = sessionState;
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  config.headers.common['Content-Type'] = contentType ? contentType : defaultForJSON;
  return config;
});

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshToken().then(
        function (value) {
          // console.log('value:', value);
        },
        async function (error) {
          // console.log('err:', error);
          await logout();
          window.location.reload();
          // const history = useHistory();
          // return history.push({
          //   pathname: '/login',
          // });
        }
      );

      const token = getAccessToken();
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      return instance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export function get(path: string, contentType = defaultForJSON) {
  contentType = contentType;
  return instance
    .get(path)
    .then((result: any) => {
      if (result.status == 200) {
        return result.data;
      } else if (result.status == 204) {
        return result.status;
      }
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        const err = new ApiError(
          error.response?.status,
          ERROR_CODE.TIME_OUT,
          'ไม่สามารถเชื่อมต่อระบบสมาชิกได้ในเวลาที่กำหนด'
        );
        throw err;
      }

      const err = new ApiError(
        error.response?.status,
        error.response?.data.error_code,
        error.response?.data.error_message
      );
      throw err;
    });
}

export function getFile(path: string, contentType = defaultForJSON) {
  contentType = contentType;

  return instance
    .get(path, {
      responseType: 'blob',
    })
    .then((result: any) => {
      if (result.status == 200) {
        return result;
      }
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        const err = new ApiError(
          error.response?.status,
          ERROR_CODE.TIME_OUT,
          'ไม่สามารถเชื่อมต่อระบบสมาชิกได้ในเวลาที่กำหนด'
        );
        throw err;
      }

      const err = new ApiError(
        error.response?.status,
        error.response?.data.error_code,
        error.response?.data.error_message
      );
      throw err;
    });
}

export function post(path: string, payload?: any, contentType = defaultForJSON) {
  contentType = contentType;
  return instance
    .post(path, payload)
    .then((response: AxiosResponse) => {
      if (response.status == 200) {
        return response.data;
      }
    })
    .catch((error: any) => {
      const err = new ApiError(error.response?.status, error.response?.data.code, error.response?.data.message);
      throw err;
    });
}

export function put(path: string, payload: any, contentType = defaultForJSON) {
  contentType = contentType;
  return instance
    .put(path, payload)
    .then((response: AxiosResponse) => {
      if (response.status == 200 || response.status == 201) {
        return response.data;
      }
      const err = new ApiError(response.status, response.status, response.statusText);
      throw err;
    })
    .catch((error: any) => {
      const err = new ApiError(error.response?.status, error.response?.data.code, error.response?.data.message);
      throw err;
    });
}

export function deleteData(path: string, contentType = defaultForJSON) {
  contentType = contentType;
  return instance
    .delete(path)
    .then((result: any) => {
      return result;
    })
    .catch((error: any) => {
      const err = new ApiError(error.response?.status, error.response?.data.code, error.response?.data.message);
      throw err;
    });
}

export function deleteDataBody(path: string, payload: any, contentType = defaultForJSON) {
  contentType = contentType;
  return instance
    .delete(path, { data: payload })
    .then((response: AxiosResponse) => {
      return response;
    })
    .catch((error: any) => {
      const err = new ApiError(error.response?.status, error.response?.data.code, error.response?.data.message);
      throw err;
    });
}
