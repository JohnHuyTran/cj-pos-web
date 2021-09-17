import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Task from './task';

export default function Tasklist() {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      marginTop: '8px',
    },
  });

  const classes = useStyles();

  return (
    <div>
      <Typography variant='h6'> งานของคุณ </Typography>
      <Divider />
      <Task
        functionName='ส่วนลดสินค้า'
        branchName='สาขาสีลม'
        transactionDate='24-08-2564 10.40 น.'
      />
      <Task
        functionName='ส่วนลดสินค้า'
        branchName='สาขาสีบางรัก'
        transactionDate='24-08-2564 11.20 น.'
      />
    </div>
  );
}
