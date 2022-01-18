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
        url: '/order/shipment-deliverly',
      },
      detail: {
        url: '/order/shipment-deliverly',
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
        url: '/campaign'
      }
    }
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
    transferReasonsList: {
      url: '/stock/master-transfer-reasons',
    },
    saveStockTransfer: {
      url: '/stock/stock-transfer/draft',
    },
  },
  barcodeDiscount: {
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
      url: '/campaign/{id}'
    },
  }
};
