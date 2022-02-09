import { KeyCloakTokenInfo } from '../models/keycolak-token-info';
import { getUserInfo } from '../store/sessionStore';
import { ACTIONS, MAINMENU, SUBMENU } from './enum/acl-enum';

export const isAllowActionPermission = (key: string) => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  userInfo.groups;
};

export const isAllowMenuPermission = (key: string) => {
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  return Object.keys(userInfo.group) ? true : false;
};

const permission = {
  scm: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK],
      subment: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_CHECK],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
  oc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK],
      subment: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_CHECK],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
  dc: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK],
      subment: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_CHECK],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
  branch: {
    menu: {
      mainmenu: [MAINMENU.SALE, MAINMENU.STOCK],
      subment: [SUBMENU.SALE_DISCOUNT, SUBMENU.STOCK_CHECK],
    },
    action: [ACTIONS.PURCHASE_PI_CLOSE, ACTIONS.PURCHASE_PN_EXPORT],
  },
};
