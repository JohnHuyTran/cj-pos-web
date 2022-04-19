import { env } from '../adapters/environmentConfigs';
import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';
import {
  ACTIONS,
  KEYCLOAK_GROUP_AREA_MANAGER01,
  KEYCLOAK_GROUP_AUDIT,
  KEYCLOAK_GROUP_BRANCH_MANAGER,
  KEYCLOAK_GROUP_BRANCH_MANAGER01,
  KEYCLOAK_GROUP_DC01,
  KEYCLOAK_GROUP_DC02,
  KEYCLOAK_GROUP_DISTRICT_MANAGER,
  KEYCLOAK_GROUP_OC01,
  KEYCLOAK_GROUP_SCM01,
  KEYCLOAK_GROUP_SM,
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

  if (group === KEYCLOAK_GROUP_DC01 || group === KEYCLOAK_GROUP_DC02) {
    return PERMISSION_GROUP.DC;
  } else if (group === KEYCLOAK_GROUP_BRANCH_MANAGER01 || group === KEYCLOAK_GROUP_BRANCH_MANAGER) {
    return PERMISSION_GROUP.BRANCH;
  } else if (group === KEYCLOAK_GROUP_SCM01) {
    return PERMISSION_GROUP.SCM;
  } else if (group === KEYCLOAK_GROUP_OC01) {
    return PERMISSION_GROUP.OC;
  } else if (group === KEYCLOAK_GROUP_AREA_MANAGER01) {
    return PERMISSION_GROUP.AREA_MANAGER;
  } else if (group === KEYCLOAK_GROUP_AUDIT) {
    return PERMISSION_GROUP.AUDIT;
  } else if (group === KEYCLOAK_GROUP_DISTRICT_MANAGER) {
    return PERMISSION_GROUP.DISTRICT_MANAGER;
  } else if (group === KEYCLOAK_GROUP_SM) {
    return PERMISSION_GROUP.SM;
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

export const isGroupBranchParam = (group: string) => {
  return group === PERMISSION_GROUP.BRANCH;
};

export const isPreferredUsername = () => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  return userInfo.preferred_username;
};

export const isChannelBranch = () => {
  return env.branch.channel === 'branch' ? true : false;
};

const permission = {
  scm: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.OR_SUPPLIER, SUBMENU.ST_REQUEST],
    },
    action: [ACTIONS.STOCK_RT_APPROVE, ACTIONS.STOCK_RT_REJECT, ACTIONS.STOCK_RT_VIEW, ACTIONS.STOCK_RT_MANAGE],
  },
  oc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE, MAINMENU.PRODUCT_INFO],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.OR_ORDER_RECEIVE, SUBMENU.ST_REQUEST, SUBMENU.PI_STOCK_BALANCE],
    },
    action: [
      ACTIONS.STOCK_RT_VIEW,
      ACTIONS.STOCK_RT_APPROVE,
      ACTIONS.STOCK_RT_REJECT,
      ACTIONS.STOCK_BL_LOCATION,
      ACTIONS.STOCK_BL_SKU,
    ],
  },
  dc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE],
      submenu: [SUBMENU.SALE_DISCOUNT, SUBMENU.OR_DIFF, SUBMENU.OR_SUPPLIER, SUBMENU.ST_TRANSFER],
    },
    action: [ACTIONS.STOCK_BT_VIEW, ACTIONS.STOCK_BT_EXPORT, ACTIONS.ORDER_VER_VIEW, ACTIONS.ORDER_VER_MANAGE],
  },
  branch: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE, MAINMENU.PRODUCT_INFO],
      submenu: [
        SUBMENU.SALE_DISCOUNT,
        SUBMENU.SALE_TAX_INVOICE,
        SUBMENU.OR_ORDER_RECEIVE,
        SUBMENU.OR_DIFF,
        SUBMENU.OR_SUPPLIER,
        SUBMENU.ST_REQUEST,
        SUBMENU.ST_TRANSFER,
        SUBMENU.PI_STOCK_BALANCE,
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
      ACTIONS.ORDER_VER_VIEW,
      ACTIONS.ORDER_VER_MANAGE,
      ACTIONS.ORDER_SD_EXPORT,
      ACTIONS.SALE_TAX_INVOICE_VIEW,
      ACTIONS.STOCK_BL_LOCATION,
      ACTIONS.STOCK_BL_SKU,
    ],
  },
  areaManager: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK_TRANSFER, MAINMENU.ORDER_RECEIVE, MAINMENU.PRODUCT_INFO],
      submenu: [
        SUBMENU.SALE_DISCOUNT,
        SUBMENU.OR_ORDER_RECEIVE,
        SUBMENU.OR_SUPPLIER,
        SUBMENU.ST_REQUEST,
        SUBMENU.ST_TRANSFER,
        SUBMENU.PI_STOCK_BALANCE,
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
      ACTIONS.STOCK_BL_LOCATION,
      ACTIONS.STOCK_BL_SKU,
    ],
  },
  storeManagement: {
    menu: {
      mainmenu: [MAINMENU.PRODUCT_INFO],
      submenu: [SUBMENU.PI_STOCK_BALANCE],
    },
    action: [ACTIONS.STOCK_BL_LOCATION, ACTIONS.STOCK_BL_SKU],
  },
  audit: {
    menu: {
      mainmenu: [MAINMENU.PRODUCT_INFO],
      submenu: [SUBMENU.PI_STOCK_BALANCE],
    },
    action: [ACTIONS.STOCK_BL_LOCATION, ACTIONS.STOCK_BL_SKU],
  },
  saleManager: {
    menu: {
      mainmenu: [MAINMENU.PRODUCT_INFO],
      submenu: [SUBMENU.PI_STOCK_BALANCE],
    },
    action: [ACTIONS.STOCK_BL_LOCATION, ACTIONS.STOCK_BL_SKU],
  },
};
