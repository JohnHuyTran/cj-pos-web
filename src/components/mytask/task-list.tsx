import TaskForBarcodeDiscount from './task-for-barcode-discount';
import TaskForSaleLimitTime from './task-for-sale-limit-time';

interface Props {
  userPermission: any[];
  listData: any[];
  onSearch: () => void;
}

export default function Tasklist({ userPermission, listData, onSearch }: Props) {

  const approver = userPermission.includes('campaign.bd.approve');
  const requestor = userPermission.includes('campaign.bd.create');
  const viewer = !userPermission.includes('campaign.st.create');

  const listDiscount = listData.filter(
    (item: any) =>
      item.type === 'APPROVE_BARCODE' || item.type === 'SEND_BD_FOR_APPROVAL' || item.type === 'REJECT_BARCODE'
  );
  const listST = listData.filter((item: any) => item.type === 'SALE_LIMIT_START');

  const listItemTaskDiscount =
    !!approver && listDiscount.length > 0
      ? listDiscount
          .filter((el: any) => el.payload.status === 2)
          .map((item: any, index: any) => { 
            return (
              <TaskForBarcodeDiscount
                key={index}
                onSearch={onSearch}
                payload={item.payload}
                permission={approver ? 'approver' : requestor ? 'requestor' : ''}
                userPermission={userPermission}
              />
            );
          })
      : !!requestor && listDiscount.length > 0
      ? listDiscount
          .filter((el: any) => el.payload.status > 2)
          .map((item: any, index: any) => {
            return (
              <TaskForBarcodeDiscount
                key={index}
                onSearch={onSearch}
                payload={item.payload}
                permission={approver ? 'approver' : requestor ? 'requestor' : ''}
                userPermission={userPermission}
              />
            );
          })
      : null;
  const listItemTaskST =
    !!viewer && listST.length > 0
      ? listST.map((item: any, index: any) => {
          return (
            <TaskForSaleLimitTime
              key={index}
              permission={viewer ? 'viewer' : ''}
              payload={item.payload}
              onSearch={onSearch}
            />
          );
        })
      : null;

  return (
    <div>
      {listItemTaskDiscount}
      {listItemTaskST}
    </div>
  );
}
