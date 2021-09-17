import Typography from '@mui/material/Typography';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

type TaskType = {
  functionName: string;
  branchName: string;
  transactionDate: string;
};

export default function Task(props: TaskType) {
  const theme = useTheme();

  const useStyles = makeStyles({
    root: {
      marginTop: '8px',
      alignContent: 'center',
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px',
      '&:last-child': {
        paddingBottom: 8,
      },
    },
    details: {
      display: 'flex',
      paddingTop: '4px',
      paddingBottom: '4px',
    },
    action: {
      display: 'flex',
    },
    icon: {
      color: theme.palette.primary.main,
      display: 'flex',
    },
    fuctionName: {
      marginLeft: '4px',
      color: theme.palette.primary.main,
    },
    pipeSpace: {
      marginLeft: '4px',
    },
    branchName: {
      marginLeft: '4px',
    },
    transactionDate: {
      marginLeft: '4px',
      color: theme.palette.grey[500],
    },
    actionButton: {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.warning.dark,
      paddingLeft: '8px',
      paddingRight: '8px',
      paddingTop: '4px',
      paddingBottom: '4px',
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.warning.dark,
        color: theme.palette.warning.light,
      },
    },

    dueDate: {
      marginLeft: '4px',
      paddingTop: '4px',
      paddingBottom: '4px',
      color: theme.palette.primary.main,
    },
  });

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.cardContent}>
        <div className={classes.details}>
          <div className={classes.icon}>
            <LoyaltyOutlinedIcon />
          </div>
          <div className={classes.fuctionName}>
            <Typography variant='body1'>{props.functionName}</Typography>
          </div>
          <div className={classes.pipeSpace}>
            <Typography variant='body1'>|</Typography>
          </div>
          <div className={classes.branchName}>
            <Typography variant='body1'>{props.branchName}</Typography>
          </div>
          <div className={classes.transactionDate}>
            <Typography variant='body1'>
              วันที่ทำรายการ {props.transactionDate}
            </Typography>
          </div>
        </div>
        <div className={classes.action}>
          <div className={classes.actionButton}>
            <Typography>รออนุมัติ</Typography>
          </div>
          <div className={classes.dueDate}>
            <Typography>กำหนดการทำรายการ วันนี้</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
