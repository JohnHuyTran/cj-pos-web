export const environment = {
  products: {
    url: "/api/product",
    headers: {
      "Content-Type": "application/json",
    },
  },
  orders: {
    shipment: {
      save: {
        url: "/api/order-shipment"
      }
    }
  }
};
