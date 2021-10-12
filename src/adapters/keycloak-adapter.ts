import { env } from './environmentConfig';
import axios, { AxiosResponse } from 'axios';

import { loginForm, Response } from '../models/user-interface';

const instance = axios.create({
  baseURL: env.keycloak.url,
  timeout: env.keycloak.timeout,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export function authentication(payload: loginForm): Promise<Response> {
  console.log(`url: ${env.keycloak.url}`);
  const params = new URLSearchParams();
  params.append('username', payload.userId);
  params.append('password', payload.password);
  params.append('grant_type', env.keycloak.grantType);
  params.append('client_id', env.keycloak.clientId);
  params.append('client_secret', env.keycloak.clientSecret);

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
