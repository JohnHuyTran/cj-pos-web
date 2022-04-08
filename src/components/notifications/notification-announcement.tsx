import { Card, CardContent, Grid, TablePagination, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { getNotificationData } from '../../services/notification';
import { useStyles } from '../../styles/makeTheme';
import theme from '../../styles/theme';
import { ShoppingCartSharp } from '@mui/icons-material';
import { Box } from '@mui/system';
import LoadingModal from '../commons/ui/loading-modal';
import STCreateModal from '../sale-limit-time/sale-limit-time-create-modal';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getsaleLimitTimeDetail } from '../../store/slices/sale-limit-time-detail-slice';
import SnackbarStatus from '../commons/ui/snackbar-status';

interface Props {
  refresh: boolean;
  // onSearch: () => void;
}

export default function NotificationAnnouncement(props: Props) {
  const [page, setPage] = React.useState<number>(0);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState(0);
  const [listData, setListData] = React.useState<any[]>([]);
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const dispatch = useAppDispatch();
  const saleLimitTimeDetail = useAppSelector((state) => state.saleLimitTimeDetailSlice.saleLimitTimeDetail);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  const classes = useStyles();
  useEffect(() => {
    handleGetData();
  }, []);
  useEffect(() => {
    handleGetData();
  }, [page]);
  useEffect(() => {
    setPage(0);
  }, [props.refresh]);

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleGetData = async () => {
    try {
      setOpenLoadingModal(true);
      const rs = await getNotificationData(page);
      if (rs && rs.data) {
        setListData(rs.data);
        setTotal(rs.total);
      }
      setOpenLoadingModal(false);
    } catch (error) {
      setOpenLoadingModal(false);
    }
  };

  const currentlySelected = async (item:any) => {
    console.log(item);
    
    setOpenLoadingModal(true);
    try {
      await dispatch(getsaleLimitTimeDetail(item.payload._id));
      if (saleLimitTimeDetail.data.length > 0 || saleLimitTimeDetail.data) {
        setOpenDetail(true);
      }
    } catch (error) {
      console.log(error);
    }

    setOpenLoadingModal(false);
  };


  const listTask = listData.map((item: any, index: number) => {
    return (
      <>
        <Box key={index} sx={{ borderTop: '1px solid #EAEBEB', minHeight: '80px', cursor: 'pointer' }} onClick={() => currentlySelected(item)}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box display={'flex'} mt={1}>
              <ShoppingCartSharp sx={{ color: theme.palette.primary.main }} />
              <span style={{ marginLeft: 15, color: theme.palette.primary.main }}>กำหนด (งด) ขายสินค้า</span>
              <span style={{ marginLeft: 5, marginRight: 3 }}>: {item.payload.documentNumber}</span> {'|'}
            </Box>
            <Box sx={{ textAlign: 'right', mt: '3px' }}>
              <Typography
                sx={{
                  backgroundColor: '#E7FFE9',
                  color: '#36C690',
                  textAlign: 'center',
                  marginTop: '5px',
                  padding: '2px 25px 3px 25px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                อนุมัติ
              </Typography>
            </Box>
          </Box>
          <Box ml={5}>
            {item.payload.branch}-{item.payload.branchName}
          </Box>
          <Box ml={5} mt={2}>
            <Typography style={{ color: theme.palette.grey[500], marginBottom: '11px' }}>
              วันที่ทำรายการ {moment(item.payload.transactionDate).add(543, 'y').format('DD/MM/YYYY')}{' '}
              {moment(item.payload.transactionDate).format('HH.mm')} น.
            </Typography>
          </Box>
        </Box>
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
      {openDetail && (
        <STCreateModal
          type={'Detail'}
          isAdmin={false}
          setOpenPopup={setOpenPopup}
          setPopupMsg={setPopupMsg}
          isOpen={openDetail}
          onClickClose={handleCloseDetail}
          onSearch={handleGetData}
        />
      )}

      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
      <LoadingModal open={openLoadingModal} />
    </>
  );
}
