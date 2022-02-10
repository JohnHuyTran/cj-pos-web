import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';
import {
  ACTIONS,
  KEYCLOAK_GROUP_DC,
  KEYCLOAK_GROUP_SCM,
  MAINMENU,
  PERMISSION_GROUP,
  SUBMENU,
} from './enum/permission-enum';

const _ = require('lodash');

export const getUserGroup = (groups: string[]) => {
  const group = groups.length > 0 ? groups[0] : '';
  if (!group) {
    return '';
  }
  if (group === KEYCLOAK_GROUP_DC) {
    return PERMISSION_GROUP.DC;
  } else if (group === KEYCLOAK_GROUP_SCM) {
    return PERMISSION_GROUP.SCM;
  }
};

export const isAllowActionPermission = (key: string) => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  const permissionObj = _.get(permission, userInfo.group);
  return !permissionObj.action.some((_a: string) => {
    return _a === key;
  });
};

export const isAllowMainMenuPermission = (key: string) => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  const permissionObj = _.get(permission, userInfo.group);
  return !permissionObj.menu.mainmenu.some((_a: string) => {
    return _a === key;
  });
};

export const isAllowSubMenuPermission = (key: string) => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  const permissionObj = _.get(permission, userInfo.group);
  return !permissionObj.menu.SUBMENU.some((_a: string) => {
    return _a === key;
  });
};

const permission = {
  scm: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_DIFF],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
  oc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_DIFF],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
  dc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_DIFF],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
  branch: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_DIFF],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
};
