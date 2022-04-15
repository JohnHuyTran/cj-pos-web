import { Card, CardContent, Grid, TablePagination, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { getNotificationReminders, updateNotificationItem } from '../../services/notification';
import { useStyles } from '../../styles/makeTheme';
import theme from '../../styles/theme';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import { Box } from '@mui/system';
import LoadingModal from '../commons/ui/loading-modal';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getTransferOutDetail } from '../../store/slices/transfer-out-detail-slice';
import { getBarcodeDiscountDetail } from '../../store/slices/barcode-discount-detail-slice';
import ModalCreateBarcodeDiscount from '../barcode-discount/modal-create-barcode-discount';
import { Action, DateFormat } from '../../utils/enum/common-enum';
import { objectNullOrEmpty } from '../../utils/utils';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';
import { getUserInfo } from '../../store/sessionStore';
import ModalCreateTransferOutDestroy from '../transfer-out-destroy/modal-create-transfer-out-destroy';
import ModalCreateTransferOut from '../transfer-out/modal-create-transfer-out';
import { ShoppingCartSharp } from '@mui/icons-material';

interface Props {
  refresh: boolean;
}

export default function NotificationReminder(props: Props) {
  const [page, setPage] = React.useState(0);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState(0);
  const [listData, setListData] = React.useState<any[]>([]);
  const [openTransferOutDetail, setOpenTransferOutDetail] = React.useState(false);
  const [openTransferOutDestroyDetail, setOpenTransferOutDestroyDetail] = React.useState(false);
  const [openBDDetail, setOpenBDDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const dispatch = useAppDispatch();
  const transferOutDetail = useAppSelector((state) => state.transferOutDetailSlice.transferOutDetail);
  const barcodeDiscountDetail = useAppSelector((state) => state.barcodeDiscountDetailSlice.barcodeDiscountDetail);
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  const userPermission =
    !objectNullOrEmpty(userInfo) &&
    !objectNullOrEmpty(userInfo.acl) &&
    userInfo.acl['service.posback-campaign'] != null &&
    userInfo.acl['service.posback-campaign'].length > 0
      ? userInfo.acl['service.posback-campaign']
      : [];
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
    if (page === 0) {
      handleGetData();
    } else {
      setPage(0);
    }
  }, [props.refresh]);
  const handleCloseTODetail = () => {
    setOpenTransferOutDetail(false);
  };
  const handleCloseTODestroyDetail = () => {
    setOpenTransferOutDestroyDetail(false);
  };
  const handleCloseBDDetail = () => {
    setOpenBDDetail(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleGetData = async () => {
    try {
      setOpenLoadingModal(true);
      const rs = await getNotificationReminders(page);
      if (rs && rs.data) {
        setListData(rs.data);
        setTotal(rs.total);
      }
      setOpenLoadingModal(false);
    } catch (error) {
      setOpenLoadingModal(false);
    }
  };
  const currentlySelected = async (item: any) => {
    try {
      setOpenLoadingModal(true);
      handleUpdateRead(item.id);
      if (item.type === 'REJECT_TRANSFER_OUT' || item.type === 'CLOSE_TRANSFER_OUT') {
        if (item.payload.type === 1) {
          await dispatch(getTransferOutDetail(item.payload._id));
          if (transferOutDetail.data.length > 0 || transferOutDetail.data) {
            setOpenTransferOutDetail(true);
          }
        } else if (item.payload.type === 2) {
          await dispatch(getTransferOutDetail(item.payload._id));
          if (transferOutDetail.data.length > 0 || transferOutDetail.data) {
            setOpenTransferOutDestroyDetail(true);
          }
        }
      } else if (item.type === 'REJECT_BARCODE') {
        await dispatch(getBarcodeDiscountDetail(item.payload._id));
        if (barcodeDiscountDetail.data.length > 0 || barcodeDiscountDetail.data) {
          setOpenBDDetail(true);
        }
      }
      setOpenLoadingModal(false);
    } catch (error) {
      console.log(error);
      setOpenLoadingModal(false);
    }
  };
  const handleUpdateRead = async (id: string) => {
    await updateNotificationItem(id);
    const rs = await getNotificationReminders(page);
    if (rs && rs.data) {
      setListData(rs.data);
      setTotal(rs.total);
    }
  };

  const listTask = listData.map((item: any, index: number) => {
    return (
      <Box
        key={index}
        sx={{
          borderTop: '2px solid #EAEBEB',
          minHeight: '60px',
          backgroundColor: '#F6FFF3',
          minWidth: '600px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
        onClick={() => currentlySelected(item)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box display={'flex'} mt={1} ml={1}>
            {item.type == 'REJECT_BARCODE' ? (
              <ShoppingCartSharp sx={{ color: theme.palette.primary.main }} />
            ) : (
              <PresentToAllIcon sx={{ color: theme.palette.primary.main }} />
            )}
            <span style={{ marginLeft: 15, color: theme.palette.primary.main }}>
              {item.type === 'REJECT_BARCODE' ? 'ส่วนลดสินค้า' : 'เบิก-ใช้ในการทำกิจกรรม'}
            </span>
            <span style={{ marginLeft: 5, marginRight: 3 }}>: {item.payload.documentNumber}</span> {'|'}
            <span style={{ marginLeft: 3 }}>
              {item.branchCode}-{item.payload.branchName}
            </span>
          </Box>
          <Box sx={{ textAlign: 'right', mt: '3px' }}>
            <Typography
              sx={{
                backgroundColor: item.type === 'CLOSE_TRANSFER_OUT' ? '#EAEBEB' : '#FFD7D7',
                color: item.type === 'CLOSE_TRANSFER_OUT' ? '#676767' : '#F76C6C',
                textAlign: 'center',
                marginTop: '5px',
                padding: '2px 20px 3px 20px',
                borderRadius: '8px',
                fontSize: '15px',
              }}
            >
              {item.type === 'CLOSE_TRANSFER_OUT' ? 'ปิดงาน' : 'ไม่อนุมัติ'}
            </Typography>
          </Box>
        </Box>
        <Box ml={6}>
          <Typography style={{ color: theme.palette.grey[500], fontSize: '14px' }}>
            กำหนดดำเนินการ {moment(item.createdDate).add(543, 'y').format(DateFormat.DATE_FORMAT)}
          </Typography>
        </Box>
      </Box>
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
        <CardContent className={classes.MScrollBar} sx={{ height: '90%', overflowY: 'auto' }}>
          {listTask}
        </CardContent>
      </Card>
      {openBDDetail && (
        <ModalCreateBarcodeDiscount
          isOpen={openBDDetail}
          onClickClose={handleCloseBDDetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          onSearchBD={handleGetData}
          userPermission={userPermission}
        />
      )}
      {openTransferOutDestroyDetail && (
        <ModalCreateTransferOutDestroy
          isOpen={openTransferOutDestroyDetail}
          onClickClose={handleCloseTODestroyDetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          onSearchMain={handleGetData}
          userPermission={userPermission}
        />
      )}
      {openTransferOutDetail && (
        <ModalCreateTransferOut
          isOpen={openTransferOutDetail}
          onClickClose={handleCloseTODetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          onSearchMain={handleGetData}
          userPermission={userPermission}
        />
      )}
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
      <LoadingModal open={openLoadingModal} />
    </>
  );
}
