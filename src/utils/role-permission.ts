import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';
import {
  ACTIONS,
  KEYCLOAK_GROUP_AREA_MANAGER01,
  KEYCLOAK_GROUP_BRANCH_MANAGER,
  KEYCLOAK_GROUP_BRANCH_MANAGER01,
  KEYCLOAK_GROUP_DC01,
  KEYCLOAK_GROUP_OC01,
  KEYCLOAK_GROUP_SCM01,
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

  if (group === KEYCLOAK_GROUP_DC01) {
    return PERMISSION_GROUP.DC;
  } else if (group === KEYCLOAK_GROUP_BRANCH_MANAGER01 || group === KEYCLOAK_GROUP_BRANCH_MANAGER) {
    return PERMISSION_GROUP.BRANCH;
  } else if (group === KEYCLOAK_GROUP_SCM01) {
    return PERMISSION_GROUP.SCM;
  } else if (group === KEYCLOAK_GROUP_OC01) {
    return PERMISSION_GROUP.OC;
  } else if (group === KEYCLOAK_GROUP_AREA_MANAGER01) {
    return PERMISSION_GROUP.AREA_MANAGER;
  }

  return '';
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
  return !permissionObj.menu.submenu.some((_a: string) => {
    return _a === key;
  });
};

export const isGroupDC = () => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  return userInfo.group === PERMISSION_GROUP.DC;
};
export const isGroupBranch = () => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  return userInfo.group === PERMISSION_GROUP.BRANCH;
};

export const isPreferredUsername = () => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  return userInfo.preferred_username;
};

const permission = {
  scm: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.OR_ORDER_RECEIVE, SUBMENU.OR_SUPPLIER, SUBMENU.ST_REQUEST],
    },
    action: [ACTIONS.STOCK_RT_APPROVE, ACTIONS.STOCK_RT_REJECT, ACTIONS.STOCK_RT_VIEW, ACTIONS.STOCK_RT_MANAGE],
  },
  oc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.OR_ORDER_RECEIVE, SUBMENU.OR_SUPPLIER, SUBMENU.ST_REQUEST],
    },
    action: [ACTIONS.STOCK_RT_VIEW, ACTIONS.STOCK_RT_APPROVE, ACTIONS.STOCK_RT_REJECT],
  },
  dc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE],
      submenu: [
        SUBMENU.SALE_DISCOUNT,
        SUBMENU.OR_ORDER_RECEIVE,
        SUBMENU.OR_DIFF,
        SUBMENU.OR_SUPPLIER,
        SUBMENU.ST_TRANSFER,
      ],
    },
    action: [ACTIONS.STOCK_BT_VIEW, ACTIONS.STOCK_BT_EXPORT],
  },
  branch: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE],
      submenu: [
        SUBMENU.SALE_DISCOUNT,
        SUBMENU.OR_ORDER_RECEIVE,
        SUBMENU.OR_DIFF,
        SUBMENU.OR_SUPPLIER,
        SUBMENU.ST_REQUEST,
        SUBMENU.ST_TRANSFER,
      ],
    },
    action: [
      ACTIONS.STOCK_RT_VIEW,
      ACTIONS.STOCK_RT_MANAGE,
      ACTIONS.STOCK_RT_SEND,
      ACTIONS.STOCK_RT_APPROVE,
      ACTIONS.STOCK_RT_REJECT,
      ACTIONS.STOCK_BT_VIEW,
      ACTIONS.STOCK_BT_MANAGE,
      ACTIONS.STOCK_BT_SAVEDC,
      ACTIONS.STOCK_BT_EXPORT,
    ],
  },
  areaManager: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE],
      submenu: [
        SUBMENU.SALE_DISCOUNT,
        SUBMENU.OR_ORDER_RECEIVE,
        SUBMENU.OR_SUPPLIER,
        SUBMENU.ST_REQUEST,
        SUBMENU.ST_TRANSFER,
      ],
    },
    action: [
      ACTIONS.STOCK_RT_VIEW,
      ACTIONS.STOCK_RT_MANAGE,
      ACTIONS.STOCK_RT_SEND,
      ACTIONS.STOCK_RT_APPROVE,
      ACTIONS.STOCK_RT_REJECT,
      ACTIONS.STOCK_BT_VIEW,
      ACTIONS.STOCK_BT_MANAGE,
      ACTIONS.STOCK_BT_SAVEDC,
      ACTIONS.STOCK_BT_EXPORT,
    ],
  },
};
