export const environment = {
  products: {
    url: '/api/product',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  orders: {
    shipment: {
      fetchOrder: {
        url: '/shipment-deliverly',
      },
      saveDraft: {
        url: '/stock-diff/{sdNo}/draft',
      },
      approve: {
        url: '/stock-diff/{sdNo}/approve',
      },
      closejob: {
        url: '/stock-diff/{sdNo}/close',
      },
      printFormShipmentDeliverly: {
        url: '/stock-diff/{sdNo}/export',
      },
    },
    dcCheckOrder: {
      generateBO: {
        url: '/stock-diff/{sdNo}/approve',
      }
    }
  }
};
