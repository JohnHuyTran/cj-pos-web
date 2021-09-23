import axios, { AxiosRequestConfig } from "axios";
import { env } from "./environmentConfig";
import store from "../store/store";

const instance = axios.create({
  baseURL: env.backEnd.url,
  timeout: env.backEnd.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

export function get(path: string) {
  return instance
    .get(path)
    .then((result: any) => {
      return result.data;
    })
    .catch((error: any) => {
      return error;
    });
}

export function post(path: string, payload: any) {
  return instance
    .post(path, payload)
    .then((result: any) => {
      return result.data;
    })
    .catch((error: any) => {
      return error;
    });
}

export function deleteData(path: string) {
  return instance
    .delete(path)
    .then((result: any) => {
      return result;
    })
    .catch((error: any) => {
      return error;
    });
}

instance.interceptors.request.use(function (config: AxiosRequestConfig) {
  // const token = store.getState().auth.token;
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwbmZJNmF1MXZ5LWhRQ0s3ODJ1V2E3cWIzQVFYY1FfNnZYOWZwdE5FaHR3In0.eyJleHAiOjE2MzE3NzY3OTUsImlhdCI6MTYzMTc3NjQ5NSwianRpIjoiYjA5ZGM0ZmQtMTRlMS00M2UwLThkNTItMzU0YTBlMjU2NzM0IiwiaXNzIjoiaHR0cHM6Ly9hZG1pbi5hdXRoLWRldi5jamV4cHJlc3MuaW8vYXV0aC9yZWFsbXMvY2pleHByZXNzIiwic3ViIjoiOWY2ZDEyODEtOTJhOS00N2EzLTk0NWQtNWJkMTg0MjkzMjBjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBwLm5ld3Bvc2JhY2siLCJzZXNzaW9uX3N0YXRlIjoiMGM2ODkwMjMtZWI3ZC00MTQyLTgwOWMtYzRjNWFmODdiOTRmIiwiYWNyIjoiMSIsInNjb3BlIjoic2NvcGUubmV3cG9zYmFjayBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoicG9zMiBwb3MyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicG9zMiIsImFjbCI6eyJzZXJ2aWNlLm5ld3Bvc2JhY2siOlsiQ0FTSERSQVdFUi5ERVBPU0lUIiwiU0FMRS5JVEVNLkNBTkNFTCIsIkZFQVRVUkUuQURNSU4uU0VBUkNILkRBVEEiLCJDQVNIRFJBV0VSLldJVEhEUkFXIl19LCJnaXZlbl9uYW1lIjoicG9zMiIsImJyYW5jaCI6IjAwMDIiLCJmYW1pbHlfbmFtZSI6InBvczIiLCJlbWFpbCI6InBvczJAdGVzdC5jb20ifQ.myRuJJxraId5ZptOahCJl2lt3YQczXDbatKGrEoquzuyRz4ID1QYOi2IZT6ND4Gpa8CCvtIjWKNuUrYQbRrjG8o1dJMzSAi5pt40HXbEiBvN2QDCuCF2NMPcBYZPMlPfMyNGTAafolpJYGHhjZy_4oGGZiUSbTzgQ91iVoY_WUHgdNTk9H8c-nvKxNRXIWos92AMox6-tlLkjksQsMusu9JZWEQ2v7Fmex_oIBghxPr-r9JGstm0_f16bbvMTyPskaDoOUehKNbw6V3I1IsfJgUnbUFbOlMXuCDsGmOtKbpouycPXJvj2BJJQ11PY28W4g7w3ddffLyVm4i8_OJRBg";
  const sessionState = store.getState().auth.sessionState;
  config.headers.common["x-trace"] = sessionState;
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      // redirect("login")
      return;
    }
    return Promise.reject(error);
  }
);
