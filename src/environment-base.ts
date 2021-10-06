export const environment = {
  products: {
    url: "/api/product",
    headers: {
      "Content-Type": "application/json",
    },
  },
  orders: {
    shipment: {
      submit: {
        url: "/api/order/submit/"
      },
      approve: {
        url: "api/order/approve"
      },
      closejob: {
        url: "api/order/close"
      },
      loadPdf: {
        url: ""
      }
    }
  }
};
