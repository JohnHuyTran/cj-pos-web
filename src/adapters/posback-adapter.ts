import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from './environmentConfigs';
import store, { useAppDispatch } from '../store/store';
import { ApiError } from '../models/api-error-model';
import { ContentType } from '../utils/enum/common-enum';
import { refreshToken } from './keycloak-adapter';
import { logout } from '../store/slices/authSlice';

const defaultForJSON = ContentType.JSON;

const instance = (contentType: string) => {
  const axiosInstance = axios.create({
    baseURL: env.backEnd.url,
    timeout: env.backEnd.timeout,
    headers: {
      'Content-Type': contentType,
    },
  });

  axiosInstance.interceptors.request.use(function (config: AxiosRequestConfig) {
    const token = store.getState().auth.token;
    // const token ='eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwbmZJNmF1MXZ5LWhRQ0s3ODJ1V2E3cWIzQVFYY1FfNnZYOWZwdE5FaHR3In0.eyJleHAiOjE2MzE3NzY3OTUsImlhdCI6MTYzMTc3NjQ5NSwianRpIjoiYjA5ZGM0ZmQtMTRlMS00M2UwLThkNTItMzU0YTBlMjU2NzM0IiwiaXNzIjoiaHR0cHM6Ly9hZG1pbi5hdXRoLWRldi5jamV4cHJlc3MuaW8vYXV0aC9yZWFsbXMvY2pleHByZXNzIiwic3ViIjoiOWY2ZDEyODEtOTJhOS00N2EzLTk0NWQtNWJkMTg0MjkzMjBjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBwLm5ld3Bvc2JhY2siLCJzZXNzaW9uX3N0YXRlIjoiMGM2ODkwMjMtZWI3ZC00MTQyLTgwOWMtYzRjNWFmODdiOTRmIiwiYWNyIjoiMSIsInNjb3BlIjoic2NvcGUubmV3cG9zYmFjayBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoicG9zMiBwb3MyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicG9zMiIsImFjbCI6eyJzZXJ2aWNlLm5ld3Bvc2JhY2siOlsiQ0FTSERSQVdFUi5ERVBPU0lUIiwiU0FMRS5JVEVNLkNBTkNFTCIsIkZFQVRVUkUuQURNSU4uU0VBUkNILkRBVEEiLCJDQVNIRFJBV0VSLldJVEhEUkFXIl19LCJnaXZlbl9uYW1lIjoicG9zMiIsImJyYW5jaCI6IjAwMDIiLCJmYW1pbHlfbmFtZSI6InBvczIiLCJlbWFpbCI6InBvczJAdGVzdC5jb20ifQ.myRuJJxraId5ZptOahCJl2lt3YQczXDbatKGrEoquzuyRz4ID1QYOi2IZT6ND4Gpa8CCvtIjWKNuUrYQbRrjG8o1dJMzSAi5pt40HXbEiBvN2QDCuCF2NMPcBYZPMlPfMyNGTAafolpJYGHhjZy_4oGGZiUSbTzgQ91iVoY_WUHgdNTk9H8c-nvKxNRXIWos92AMox6-tlLkjksQsMusu9JZWEQ2v7Fmex_oIBghxPr-r9JGstm0_f16bbvMTyPskaDoOUehKNbw6V3I1IsfJgUnbUFbOlMXuCDsGmOtKbpouycPXJvj2BJJQ11PY28W4g7w3ddffLyVm4i8_OJRBg';
    const sessionState = store.getState().auth.sessionState;
    config.headers.common['x-trace'] = sessionState;
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      console.log(response);
      return response;
    },
    async function (error) {
      console.log(error);
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

        const token = store.getState().auth.token;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        return instance(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export function get(path: string, contentType = defaultForJSON) {
  return instance(contentType)
    .get(path)
    .then((result: any) => {
      if (result.status == 200) {
        return result.data;
      } else if (result.status == 204) {
        return result.status;
      }
    })
    .catch((error: any) => {
      const err = new ApiError(error.response?.status, error.response?.data.code, error.response?.data.message);
      throw err;
    });
}

export function post(path: string, payload?: any, contentType = defaultForJSON) {
  return instance(contentType)
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
  return instance(contentType)
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
  return instance(contentType)
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
  return instance(contentType)
    .delete(path, { data: payload })
    .then((response: AxiosResponse) => {
      return response;
    })
    .catch((error: any) => {
      const err = new ApiError(error.response?.status, error.response?.data.code, error.response?.data.message);
      throw err;
    });
}
