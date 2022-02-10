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
  SUPPLIER_SEARCH = 'supplier.search',
  STOCK_RT_APPROVE = 'stock.rt.approve',
  STOCK_CHECK = 'stock.check',
  STOCK_RT_EDIT = 'stock.rt.edit',
  STOCK_BT_EXPORT = 'stock.bt.export',
  STOCK_RT_REJECT = 'stock.rt.reject',
  STOCK_BT_VIEW = 'stock.bt.view',
  STOCK_BT_EDIT = 'stock.bt.edit',
  STOCK_RT_DRAFT = 'stock.rt.draft',
  STOCK_RT_VIEW = 'stock.rt.view',
  STOCK_BT_SAVE_DC = 'stock.bt.save.dc',
  STOCK_RT_SEND = 'stock.rt.send',
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
