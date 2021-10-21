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
        url: '/order/shipment-deliverly',
      },
      saveDraft: {
        // url: "/api/order/submit"
        url: '/order/stock-diff/draft',
      },
      approve: {
        url: '/order/stock-diff/{sdNo}/approve',
      },
      closejob: {
        url: '/order/close',
      },
      printFormShipmentDeliverly: {
        url: '/order/stock-diff/{shipmentNo}/export',
      },
    },
  },
};
