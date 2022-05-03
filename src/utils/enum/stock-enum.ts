const movementShowDetail = ['ORDER_RECEIVE', 'ORDER_RECEIVE_BT'];

export const isShowMovementDetail = (type: string) => {
  return movementShowDetail.includes(type);
};
