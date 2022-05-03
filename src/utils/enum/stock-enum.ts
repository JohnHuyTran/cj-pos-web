const movementShowDetail = ['ORDER_RECEIVE_LD', 'ORDER_RECEIVE_BT'];

export const isShowMovementDetail = (type: string) => {
  return movementShowDetail.includes(type);
};
