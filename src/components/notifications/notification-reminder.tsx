import { Card, CardContent, Grid, TablePagination, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { getNotificationData } from '../../services/notification';
import { useStyles } from '../../styles/makeTheme';
import theme from '../../styles/theme';

// interface Props {
//   userPermission: any[];
//   listData: any[];
//   onSearch: () => void;
// }

export default function NotificationReminder() {
  const [page, setPage] = React.useState(0);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState(0);
  const [totalPage, setTotalPage] = React.useState(1);
  const [listData, setListData] = React.useState<any[]>([]);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const classes = useStyles();
  useEffect(() => {
    moreData();
  }, []);

  const moreData = async () => {
    try {
      if (totalPage > page) {
        setOpenLoadingModal(true);
        const rs = await getNotificationData(page);
        if (rs && rs.data) {
          setListData(rs.data);
          setTotalPage(rs.totalPage);
          setTotal(rs.total);
        }
        setOpenLoadingModal(false);
      }
    } catch (error) {
      setOpenLoadingModal(false);
    }
  };

  const listTask = listData.map((item: any) => {
    return (
      <>
        <Grid container spacing={2} mb={1} sx={{ borderTop: '1px solid #EAEBEB', height: '80px' }}>
          <Grid item xs={11} sx={{ display: 'flex', marginTop: '8px' }}>
            <span style={{ fontSize: '16px' }}>[งานของฉัน]</span>
            <span style={{ marginLeft: 15, marginRight: 5, color: theme.palette.primary.main }}>ส่วนลดสินค้า</span>
            {'|'}
            <span style={{ marginLeft: 5 }}>{item.payload.documentNumber}</span>{' '}
            <span style={{ marginLeft: '15px', color: theme.palette.primary.main }}>กำหนดดำเนินการ วันนี้</span>
          </Grid>
          <Grid item xs={1} sx={{}}>
            <Typography
              sx={{
                backgroundColor: '#E7FFE9',
                color: '#36C690',
                textAlign: 'center',
                paddingTop: '4px',
                paddingBottom: '5px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              test
            </Typography>
          </Grid>
        </Grid>
        <Typography style={{ color: theme.palette.grey[500], textAlign: 'right' }}>
          วันที่ทำรายการ {moment(item.payload.transactionDate).add(543, 'y').format('DD/MM/YYYY')}{' '}
          {moment(item.payload.transactionDate).format('HH.mm')} น.
        </Typography>
      </>
    );
  });
  return (
    <>
      <Card sx={{ height: '100%', border: '1px solid #E0E0E0', borderRadius: '10px' }}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={10}
          rowsPerPageOptions={[]}
        />
        <CardContent className={classes.MScrollBar} sx={{ height: '100%', overflowY: 'auto' }}>
          {listTask}
        </CardContent>
      </Card>
    </>
  );
}
