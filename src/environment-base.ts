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
      approveOC: {
        url: '/order/stock-diff/{sdNo}/approve-oc',
      },
      closejob: {
        url: '/order/stock-diff/{sdNo}/close',
      },
      printFormShipmentDeliverly: {
        url: '/order/stock-diff/{sdNo}/export',
      },
      search: {
        url: '/order/shipment/search',
      },
      approveOrderReceive: {
        url: '/order/shipment/submit',
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
    tote: {
      searchTote: {
        url: '/order/tote/',
      },
      submitTote: {
        url: '/order/submitTote',
      },
    },
  },
  task: {
    notification: {
      url: '/task/notifications',
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
      sendForApproval: {
        url: '/campaign/{id}/waiting-approve',
      },
      approve: {
        url: '/campaign/approve-barcode/{id}',
      },
      reject: {
        url: '/campaign/barcode/reject?id={id}&reason={reason}',
      },
      print: {
        url: '/campaign/print-barcode',
      },
      cancel: {
        url: '/campaign/{id}',
      },
      upload: {
        url: '/campaign/upload',
      },
    },
    saleLimitTime: {
      detail: {
        url: '/campaign/sale-limit',
      },
      save: {
        url: '/campaign/sale-limit',
      },
      update: {
        url: '/campaign/sale-limit/{id}',
      },
      start: {
        url: '/campaign/sale-limit/start/{id}',
      },
      startMultipe: {
        url: '/campaign/sale-limit/start',
      },
      cancel: {
        url: '/campaign/sale-limit/cancel',
      },
      upload: {
        url: '/campaign/sale-limit/upload',
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
    type: {
      search: {
        url: '/products/type/all',
      },
      productByType: {
        url: '/products/barcode/type',
      },
    },
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
      submitTransfer: {
        url: '/stock/stock-transfer/submit-transfer',
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
      approve2BySCM: {
        url: '/stock/stock-request/submit/approve/{rtNo}',
      },
      approve2MultipleBySCM: {
        url: '/stock/stock-request/approve2',
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
      downloadTemplate: {
        url: '/stock/stock-request/download/template',
      },
      importStockRequest: {
        url: '/stock/stock-request/import',
      },
    },
    stockBalanceCheck: {
      url: '/stock/stock-balance-check',
    },
    stockBalance: {
      stockBalanceBySKU: {
        url: '/stock/stock-balance/check-by-sku-codes',
      },
    },
  },
  master: {
    branch: {
      province: {
        url: '/master/branch/province',
      },
      searchBranch: {
        url: '/master/branch/search',
      },
      allBranch: {
        url: '/master/branches',
      },
      branchTotal: {
        url: '/master/branch/branch-total',
      },
    },
    file: {
      huawei: {
        pathFile: {
          url: '/master/getUrl',
        },
      },
    },
    provinces: {
      url: '/master/provinces',
    },
    districts: {
      url: '/master/districts',
    },
    subDistricts: {
      url: '/master/sub-districts',
    },
  },
  authority: {
    authorizedBranch: {
      url: '/authority/authorized-branches',
    },
  },
  sale: {
    taxInvoice: {
      search: {
        url: '/sale/tax-invoices',
      },
      detail: {
        url: '/sale/tax-invoices/{billNo}',
      },
      saveInvoice: {
        url: '/sale/tax-invoices',
      },
      requestTaxInvoice: {
        url: '/sale/transactions/{billNo}',
      },
    },
    member: {
      searchMemberInformation: {
        url: '/sale/members/{memberNo}',
      },
    },
  },
};
