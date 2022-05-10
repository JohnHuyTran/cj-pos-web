export enum MOVEMENT_TYPE {
  ORDER_RECEIVE_LD = 'ORDER_RECEIVE_LD',
  ORDER_RECEIVE_BT = 'ORDER_RECEIVE_BT',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  PURCHASE_NOTE = 'PURCHASE_NOTE',
  ADJ_TRNS_IN_LD = 'ADJ_TRNS_IN_LD',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_OUT_DESTROY = 'TRANSFER_OUT_DESTROY',
}

const movementShowDetail = [
  MOVEMENT_TYPE.ORDER_RECEIVE_LD,
  MOVEMENT_TYPE.ORDER_RECEIVE_BT,
  MOVEMENT_TYPE.PURCHASE_NOTE,
  MOVEMENT_TYPE.PURCHASE_ORDER,
  MOVEMENT_TYPE.ADJ_TRNS_IN_LD,
  MOVEMENT_TYPE.TRANSFER_OUT,
  MOVEMENT_TYPE.TRANSFER_OUT_DESTROY,
];

export const isShowMovementDetail = (type: string) => {
  return movementShowDetail.some((_a: string) => {
    return _a === type;
  });
};
