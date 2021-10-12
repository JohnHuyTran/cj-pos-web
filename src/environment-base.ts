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
        url: '/api/stock-diff/{sdNo}/draft'
      },
      approve: {
        url: "/api/stock-diff/{sdNo}/approve"
      },
      closejob: {
        url: "api/order/close"
      },
      printFormShipmentDeliverly: {
        url: '/api/stock-diff/{shipmentNo}/export'
      }
    }
  }
};
