export const environment = {
  products: {
    url: "/api/product",
    headers: {
      "Content-Type": "application/json",
    },
  },
  orders: {
    shipment: {
      saveDraft: {
        // url: "/api/order/submit"
        url: '/api/order/stock-diff/draft'
      },
      approve: {
        url: "/api/order/stock-diff/{sdNo}/approve"
      },
      closejob: {
        url: "api/order/close"
      },
      printFormShipmentDeliverly: {
        url: '/api/order/stock-diff/{shipmentNo}/export'
      }
    }
  }
};
