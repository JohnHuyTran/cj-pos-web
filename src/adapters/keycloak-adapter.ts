import { env } from './environmentConfigs';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { loginForm, Response } from '../models/user-interface';
import {
  setAccessToken,
  setRefreshToken,
  setSessionId,
  getAccessToken,
  getRefreshToken,
  setUserInfo,
} from '../store/sessionStore';
import { getDecodedAccessToken, objectNullOrEmpty, stringNullOrEmpty } from '../utils/utils';
import { getUserGroup } from '../utils/role-permission';
import { POSException } from '../utils/exception/pos-exception';
import { ERROR_CODE } from '../utils/enum/common-enum';

const instance = axios.create({
  baseURL: env.keycloak.url,
  timeout: env.keycloak.timeout,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
let branchCode = '';

export function authentication(payload: loginForm): Promise<Response> {
  const params = new URLSearchParams();
  params.append('username', payload.userId);
  params.append('password', payload.password);
  params.append('grant_type', env.keycloak.grantType);
  params.append('client_id', env.keycloak.clientId);
  params.append('branchCode', payload.branchCode);
  // params.append("client_secret", env.keycloak.clientSecret);
  branchCode = payload.branchCode;
  return instance
    .post(env.keycloak.url, params)
    .then((response: AxiosResponse) => {
      if (response.status == 200) {
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        setSessionId(response.data.session_state);
        let userInfo = getDecodedAccessToken(response.data.access_token ? response.data.access_token : '');
        const _group = getUserGroup(userInfo.groups);
        if (stringNullOrEmpty(_group)) {
          const err = new POSException(401, ERROR_CODE.NOT_AUTHORIZE, 'ผู้ใช้งานไม่สิทธิ์');
          throw err;
        }

        userInfo = { ...userInfo, group: _group ? _group : '' };
        setUserInfo(userInfo);
        return response.data;
      }

      throw new Error(response.status.toString());
    })
    .catch((error: any) => {
      // if (error.code === 'Network Error') {
      //   const err = new POSException(
      //     error.response?.status,
      //     ERROR_CODE.TIME_OUT,
      //     'ไม่สามารถเชื่อมต่อระบบสมาชิกได้ในเวลาที่กำหนด'
      //   );
      // }
      if (error.code) {
        throw new Error(error.code);
      }
      if (error.response.status) {
        throw new Error(error.response.status);
      }
    });
}

export function refreshToken(): Promise<Response> {
  try {
    const refreshToken = getRefreshToken();
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken ? refreshToken : '');
    params.append('client_id', env.keycloak.clientId);
    return instance
      .post(env.keycloak.url, params)
      .then((response: any) => {
        if (response.status === 200) {
          setRefreshToken(response.data.refresh_token);
          setAccessToken(response.data.access_token);
          let userInfo = getDecodedAccessToken(response.data.access_token ? response.data.access_token : '');
          const _group = getUserGroup(userInfo.groups);
          userInfo = { ...userInfo, group: _group ? _group : '' };
          setUserInfo(userInfo);
          return response.data;
        }
        throw new Error(response.status.toString());
      })
      .catch((error: any) => {
        throw new Error('refresh token failed');
      });
  } catch (error) {
    throw new Error('refresh token failed');
  }
}

instance.interceptors.request.use(function (config: AxiosRequestConfig) {
  config.headers.common['X-Requested-With'] = branchCode;
  return config;
});
