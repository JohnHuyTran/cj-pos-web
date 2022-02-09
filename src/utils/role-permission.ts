import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';

export const isAllowActionPermission = (key: string) => {
  const acl: KeyCloakTokenInfo = getUserInfo();
  return true;
};

export const isAllowMenuPermission = (key: string) => {
  const aclGroup: KeyCloakTokenInfo = getUserInfo();
  return aclGroup.acl[key] ? true : false;
};
