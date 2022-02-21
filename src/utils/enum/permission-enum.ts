export enum ACTIONS {
  PURCHASE_PN_EXPORT = 'purchase.pn.export',
  PURCHASE_PI_CLOSE = 'purchase.pi.close',
  PURCHASE_PI_EXPORT = 'purchase.pi.export',
  PURCHASE_PI_DRAFT = 'purchase.pi.draft',
  PURCHASE_FILE_DOWNLOAD = 'purchase.file.download',
  PURCHASE_PN_VIEW = 'purchase.pn.view',
  PURCHASE_PO_VIEW = 'purchase.po.view',
  PURCHASE_PN_DRAFT = 'purchase.pn.draft',
  PURCHASE_PN_EDIT = 'purchase.pn.edit',
  PURCHASE_PI_VIEW = 'purchase.pi.view',
  PURCHASE_PI_APPROVE = 'purchase.pi.approve',
  PURCHASE_PI_EDIT = 'purchase.pi.edit',
  PURCHASE_PN_APPROVE = 'purchase.pn.approve',
  PURCHASE_FILE_REMOVE = 'purchase.file.remove',
  CAMPAIGN_BD_PRINT = 'campaign.bd.print',
  CAMPAIGN_BD_VIEW = 'campaign.bd.view',
  CAMPAIGN_BD_CREATE = 'campaign.bd.create',
  CAMPAIGN_BD_APPROVE = 'campaign.bd.approve',
  SUPPLIER_SEARCH = 'supplier.search',

  STOCK_RT_VIEW = 'stock.rt.view',
  STOCK_RT_MANAGE = 'stock.rt.manage',
  STOCK_RT_SEND = 'stock.rt.send',
  STOCK_RT_APPROVE = 'stock.rt.approve',
  STOCK_RT_REJECT = 'stock.rt.reject',

  STOCK_BT_VIEW = 'stock.bt.view',
  STOCK_BT_MANAGE = 'stock.rt.manage',
  STOCK_BT_SAVEDC = 'stock.bt.save_dc',
  STOCK_BT_EXPORT = 'stock.bt.export',
  STOCK_BT_WAITDC = 'stock.bt.wait_dc',

  AUTHORITY_CHECK = 'authority.check',
  ORDER_RO_DRAFT = 'order.ro.draft',
  ORDER_RO_APPROVE = 'order.ro.approve',
  ORDER_RO_CLOSE = 'order.ro.close',
  ORDER_RO_EDIT = 'order.ro.edit',
  ORDER_RO_VIEW = 'order.ro.view',
  ORDER_RO_EXPORT = 'order.ro.export',
  ORDER_DC_VERIFY = 'order.dc.verify',
  ORDER_DC_VIEW = 'order.dc.view',
  PRODUCT_SEARCH = 'product.search',
}

export enum MAINMENU {
  SALE = 'sale',
  ORDER_RECEIVE = 'orderReceive',
  STOCK_TRANSFER = 'stockTransfer',
}

export enum SUBMENU {
  SALE_DISCOUNT = 'sale.discount',
  OR_ORDER_RECEIVE = 'orderReceive.orderReceive',
  OR_DIFF = 'orderReceive.stockDiff',
  OR_SUPPLIER = 'orderReceive.supplier',
  ST_REQUEST = 'stockTransfer.stockRequest',
  ST_TRANSFER = 'stockTransfer.stockTransfer',
}

export enum PERMISSION_GROUP {
  DC = 'dc',
  SCM = 'scm',
  OC = 'oc',
  BRANCH = 'branch',
}

export const KEYCLOAK_GROUP_DC01 = '/service.posback/dc01';
export const KEYCLOAK_GROUP_SCM = '/service.posback/scm';
export const KEYCLOAK_GROUP_OC1 = '/service.posback/oc01';
export const KEYCLOAK_GROUP_BRANCH_MANAGER01 = '/service.posback/branch-manager';
export const KEYCLOAK_GROUP_BRANCH_MANAGER = '/service.posback/manager';
