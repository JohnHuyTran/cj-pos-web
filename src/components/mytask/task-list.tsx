import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useEffect } from 'react';
import TaskForBarcodeDiscount from './task-for-barcode-discount';
import TaskForSaleLimitTime from './task-for-sale-limit-time';

interface Props {
  userPermission: any[];
  listData: any[];
  onSearch: () => void;
}

export default function Tasklist({ userPermission, listData, onSearch }: Props) {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      marginTop: '8px',
    },
  });

  const approver = userPermission.includes('campaign.bd.approve');
  const requestor = userPermission.includes('campaign.bd.create');
  const viewer = userPermission.includes('campaign.st.view');

  const listDiscount = listData.filter((item: any) => item.type === 'APPROVE_OR_REJECT_BD');
  const listST = listData.filter((item: any) => item.type === 'ST_START');

  const listItemTaskDiscount =
    approver && listDiscount.length > 0
      ? listDiscount.map((item: any) => {
          return (
            <TaskForBarcodeDiscount
              onSearch={onSearch}
              payload={item.payload}
              permission={approver ? 'approver' : requestor ? 'requestor' : ''}
              userPermission={userPermission}
            />
          );
        })
      : requestor && listDiscount.length > 0
      ? listDiscount.map((item: any) => {
          return (
            <TaskForBarcodeDiscount
              onSearch={onSearch}
              payload={item.payload}
              permission={approver ? 'approver' : requestor ? 'requestor' : ''}
              userPermission={userPermission}
            />
          );
        })
      : null;
  const listItemTaskST =
    viewer && listST.length > 0
      ? listST.map((item: any) => {
          return (
            <TaskForSaleLimitTime permission={viewer ? 'viewer' : ''} payload={item.payload} onSearch={onSearch} />
          );
        })
      : null;

  const classes = useStyles();

  return (
    <div>
      {listItemTaskDiscount}
      {listItemTaskST}
    </div>
  );
}
