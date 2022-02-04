const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const SESSION_ID = 'session_id';

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN);
};

export const setAccessToken = (value: string) => {
  return sessionStorage.setItem(ACCESS_TOKEN, value);
};

export const removeAccessToken = () => {
  return sessionStorage.removeItem(ACCESS_TOKEN);
};

export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN);
};

export const setRefreshToken = (value: string) => {
  return sessionStorage.setItem(REFRESH_TOKEN, value);
};

export const removeRefreshToken = () => {
  return sessionStorage.removeItem(REFRESH_TOKEN);
};

export const getSessionId = () => {
  return sessionStorage.getItem(SESSION_ID);
};

export const setSessionId = (value: string) => {
  return sessionStorage.setItem(SESSION_ID, value);
};

export const removeSessionId = () => {
  return sessionStorage.removeItem(SESSION_ID);
};
