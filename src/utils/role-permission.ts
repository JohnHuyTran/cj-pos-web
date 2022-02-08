import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';

export const isAllowPermission = () => {
  const acl: KeyCloakTokenInfo = getUserInfo();
  return true;
};

export const isAllowMenuPermission = (key: string) => {
  const aclGroup: KeyCloakTokenInfo = getUserInfo();
  aclGroup.acl[key];
};
