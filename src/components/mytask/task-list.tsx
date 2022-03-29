import TaskForBarcodeDiscount from './task-for-barcode-discount';
import TaskForSaleLimitTime from './task-for-sale-limit-time';
import TaskForTransferOut from './task-for-transfer-out';

interface Props {
  userPermission: any[];
  listData: any[];
  onSearch: () => void;
}

export default function Tasklist({ userPermission, listData, onSearch }: Props) {
  const approver = userPermission.includes('campaign.bd.approve');
  const requestor = userPermission.includes('campaign.bd.create');
  const viewer = !userPermission.includes('campaign.st.create');
  console.log(listData);

  const listItemTask =
    listData.length > 0
      ? listData.map((item: any, index: any) => {
          if (
            item.type === 'APPROVE_BARCODE' ||
            item.type === 'SEND_BD_FOR_APPROVAL' ||
            item.type === 'REJECT_BARCODE'
          ) {
            return (
              <TaskForBarcodeDiscount
                key={index}
                onSearch={onSearch}
                payload={item.payload}
                permission={approver ? 'approver' : requestor ? 'requestor' : ''}
                userPermission={userPermission}
              />
            );
          } else if (item.type === 'SALE_LIMIT_START' || item.type === 'SALE_LIMIT_END') {
            return (
              <TaskForSaleLimitTime
                key={index}
                onSearch={onSearch}
                payload={item.payload}
                permission={approver ? 'approver' : requestor ? 'requestor' : ''}
              />
            );
          } else if (
            item.type === 'APPROVE_TRANSFER_OUT' ||
            item.type === 'REJECT_TRANSFER_OUT' ||
            item.type === 'CLOSE_TRANSFER_OUT'
          ) {
            return (
              <TaskForTransferOut
                key={index}
                onSearch={onSearch}
                payload={item.payload}
                permission={approver ? 'approver' : requestor ? 'requestor' : ''}
                userPermission={userPermission}
              />
            );
          } else {
            return null;
          }
        })
      : null;

  return <>{listItemTask}</>;
}
