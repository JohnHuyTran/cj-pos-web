import { env } from './environmentConfigs';
import axios, { AxiosResponse } from 'axios';

import { loginForm, Response } from '../models/user-interface';
import store, { useAppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';

const instance = axios.create({
  baseURL: env.keycloak.url,
  timeout: env.keycloak.timeout,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export function authentication(payload: loginForm): Promise<Response> {
  const params = new URLSearchParams();
  params.append('username', payload.userId);
  params.append('password', payload.password);
  params.append('grant_type', env.keycloak.grantType);
  params.append('client_id', env.keycloak.clientId);
  // params.append("client_secret", env.keycloak.clientSecret);

  return instance
    .post(env.keycloak.url, params)
    .then((response: AxiosResponse) => {
      if (response.status == 200) {
        return response.data;
      }
      throw new Error(response.status.toString());
    })
    .catch((error: any) => {
      throw new Error(error.response.data.error_description);
      // throw new KeyCloakError(error.response.status,error.response.data.error_description);
    });
}

export function refreshToken(): Promise<Response> {
  const dispatch = useAppDispatch();
  const refresh_Token: any = store.getState().auth.refreshToken;
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refresh_Token);
  params.append('client_id', env.keycloak.clientId);

  return instance
    .post(env.keycloak.path.url, params)
    .then((response: any) => {
      if (response.status === 200) {
        dispatch(refreshTokenState(response.data));
        return response.data;
      }
      throw new Error(response.status.toString());
    })
    .catch((error: any) => {
      dispatch(logout());
      throw new Error('refresh token failed');
    });
}
function refreshTokenState(data: any): any {
  throw new Error('Function not implemented.');
}
