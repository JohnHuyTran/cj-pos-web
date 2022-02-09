export enum ACTIONS {
  PURCHASE_PN_EXPORT = 'purchase.pn.export',
  PURCHASE_PI_CLOSE = 'purchase.pi.close',
}

export enum MAINMENU {
  SALE = 'sale',
  STOCK = 'stock',
}

export enum SUBMENU {
  SALE_DISCOUNT = 'sale.discount',
  STOCK_CHECK = 'stock.checking',
  STOCK_SUPPLY = 'stock.supply',
  STOCK_REQUEST = 'stock.request',
  STOCK_TRANSFER = 'stock.transfer',
}

export enum PERMISSION_GROUP {
  DC = 'dc',
  SCM = 'scm',
  OC = 'oc',
}

export const KEYCLOAK_GROUP_DC = '/service.posback/manager';
export const KEYCLOAK_GROUP_SCM = '/service.posback/scm';
export const KEYCLOAK_GROUP_OC = '/service.posback/OC';
