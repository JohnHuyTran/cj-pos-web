export const environment = {
  product: {
    url: '/api/product',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  orders: {
    shipment: {
      fetchOrder: {
        url: '/order/shipment-delivery',
      },
      detail: {
        url: '/order/shipment-delivery',
      },
      fetchOrderSD: {
        url: '/order/sd',
      },
      saveDraft: {
        url: '/order/stock-diff/{sdNo}/draft',
      },
      approve: {
        url: '/order/stock-diff/{sdNo}/approve',
      },
      closejob: {
        url: '/order/stock-diff/{sdNo}/close',
      },
      printFormShipmentDeliverly: {
        url: '/order/stock-diff/{sdNo}/export',
      },
    },
    dcCheckOrder: {
      fetchOrder: {
        url: '/order/stock-diff/verifies',
      },
      generateBO: {
        url: '/order/stock-diff/{sdNo}/approve',
      },
      searchBranch: {
        url: '/order/master/branches',
      },
      detailDC: {
        url: '/order/stock-diff/verify/view',
      },
      approve: {
        url: '/order/stock-diff/verify/{idDC}',
      },
    },
  },
  sell: {
    barcodeDiscount: {
      search: {
        url: '/campaign',
      },
      detail: {
        url: '/campaign/detail-barcode',
      },
      save: {
        url: '/campaign',
      },
      update: {
        url: '/campaign/{id}',
      },
      approve: {
        url: '/campaign/{id}/waiting-approve',
      },
      cancel: {
        url: '/campaign/{id}',
      },
    },
  },
  purchase: {
    supplierOrder: {
      search: {
        url: '/purchase/purchase-invoice',
      },
      detail: {
        url: '/purchase/purchase-invoice',
        // url: '/purchase/pi',
      },
      saveDraft: {
        url: '/purchase/purchase-invoice/{piNo}/draft',
        // url: '/purchase/purchase/{piNo}/draft',
      },
      approve: {
        url: '/purchase/purchase-invoice/{piNo}/approve',
        // url: '/purchase/purchase/{piNo}/approve',
      },
      detailPI: {
        url: '/purchase/purchase-order',
      },
      saveDraftPI: {
        url: '/purchase/purchase-invoice/draft',
      },
      approvePI: {
        url: '/purchase/purchase-invoice/approve',
      },
      searchSupplier: {
        url: '/supplier',
      },
      searchSupplierPO: {
        url: '/purchase/receivable-purchase-order',
      },
      calculatePI: {
        url: '/purchase/purchase-invoice/calculate',
      },
      supplierFile: {
        url: '/purchase/getUrl',
      },
      exportFile: {
        url: '/purchase/purchase-invoice/{piNo}/export',
      },
      delFileHuawei: {
        url: '/purchase/remove-file',
      },
    },
    purchaseNote: {
      detail: {
        url: '/purchase/purchase-note/{piNo}',
      },
      save: {
        url: '/purchase/purchase-note/{piNo}/save',
      },
      approve: {
        url: '/purchase/purchase-note/approve/{pnNo}',
      },
      exportFile: {
        url: '/purchase/purchase-note/export/{pnNo}',
      },
    },
  },
  products: {
    addItem: {
      allitemsList: {
        url: '/products/barcode/all',
      },
      itemList: {
        url: '/products/',
      },
      itemByBarcode: {
        url: '/products/barcode/',
      },
    },
  },
  stock: {
    searchStockTransfer: {
      url: '/stock/stock-transfer',
      searchRT: {
        url: '/stock/stock-request',
      },
    },
    transferReasonsList: {
      url: '/stock/master-transfer-reasons',
    },
    branchTransfer: {
      search: {
        url: '/stock/stock-transfer',
      },
      detail: {
        url: '/stock/stock-transfer/{btNo}',
      },
      save: {
        url: '/stock/stock-transfer/save',
      },
      sendDC: {
        url: '/stock/stock-transfer/save-to-dc',
      },
      reportBO: {
        url: '/stock/stock-transfer/export/branch-out/{btNo}',
      },
      reportBT: {
        url: '/stock/stock-transfer/export/{btNo}',
      },
      reportReCall: {
        url: '/stock/stock-transfer/export/recall/{btNo}',
      },
      reportPaperBox: {
        url: '/stock/stock-transfer/export/bt-cover-sheet/{btNo}',
      },
      sendToPickup: {
        url: '/stock/stock-transfer/save-wait-dc',
      },
    },
    stockRequest: {
      detail: {
        url: '/stock/stock-request/{rtNo}',
      },
      save: {
        url: '/stock/stock-request/draft',
      },
      submit: {
        url: '/stock/stock-request/submit/{rtNo}',
      },
      approve1: {
        url: '/stock/stock-request/approve1/{rtNo}',
      },
      approve2: {
        url: '/stock/stock-request/approve2/{rtNo}',
      },
      reject1: {
        url: '/stock/stock-request/reject1/{rtNo}',
      },
      reject2: {
        url: '/stock/stock-request/reject2/{rtNo}',
      },
      remove: {
        url: '/stock/stock-request/remove/{rtNo}',
      },
    },
    stockBalanceCheck: {
      url: '/stock/stock-balance-check',
    },
  },
};
