export const environment = {
  products: {
    url: "/api/product",
    headers: {
      "Content-Type": "application/json",
    },
  },
  orders: {
    shipment: {
      fetchOrder: {
        url: "/order/shipment-deliverly",
      },
      fetchOrderSD: {
        url: "/order/sd",
      },
      saveDraft: {
        url: "/order/stock-diff/{sdNo}/draft",
      },
      approve: {
        url: "/order/stock-diff/{sdNo}/approve",
      },
      closejob: {
        url: "/order/stock-diff/{sdNo}/close",
      },
      printFormShipmentDeliverly: {
        url: "/order/stock-diff/{sdNo}/export",
      },
    },
    dcCheckOrder: {
      fetchOrder: {
        url: "/order/stock-diff/verifies",
      },
      generateBO: {
        url: "/order/stock-diff/{sdNo}/approve",
      },
      searchBranch: {
        url: "/order/master/branches",
      },
      detailDC: {
        url: "/order/stock-diff/verify/view",
      },
      approve: {
        url: "/order/stock-diff/verify/{idDC}",
      },
    },
  },
  purchase: {
    supplierOrder: {
      search: {
        url: "/purchase/purchase-invoice",
      },
      detailDC: {
        url: "/stock-diff/verify/view",
      },
      approve: {
        url: "/stock-diff/verify/{idDC}",
      },
    },
  },
};
