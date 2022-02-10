export enum ACTIONS {
  PURCHASE_PN_EXPORT = 'purchase.pn.export',
  PURCHASE_PI_CLOSE = 'purchase.pi.close',
}

export enum MAINMENU {
  SALE = 'sale',
  ORDER_RECEIVE = 'orderReceive',
}

export enum SUBMENU {
  SALE_DISCOUNT = 'sale.discount',
  STOCK_ORDER_RECEIVE = 'orderReceive.orderReceive',
  STOCK_DIFF = 'orderReceive.stockDiff',
  STOCK_SUPPLIER = 'orderReceive.supplier',
  STOCK_REQUEST = 'orderReceive.stockRequest',
  STOCK_TRANSFER = 'orderReceive.stockTransfer',
}

export enum PERMISSION_GROUP {
  DC = 'dc',
  SCM = 'scm',
  OC = 'oc',
}

export const KEYCLOAK_GROUP_DC = '/service.posback/manager';
export const KEYCLOAK_GROUP_SCM = '/service.posback/scm';
export const KEYCLOAK_GROUP_OC = '/service.posback/oc';
