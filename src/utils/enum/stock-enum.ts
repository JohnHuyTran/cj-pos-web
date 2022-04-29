const movementShowDetail = ['ORDER_RECEIVE_', 'ORDER_RECEIVE_BT'];

export const isShowMovementDetail = (type: string) => {
  return movementShowDetail.includes(type);
};
