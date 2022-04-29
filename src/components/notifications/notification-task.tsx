import { Card, CardContent, Grid, TablePagination, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useStyles } from '../../styles/makeTheme';
import theme from '../../styles/theme';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import { Box } from '@mui/system';
import LoadingModal from '../commons/ui/loading-modal';
import { getNotificationTasks, updateNotificationItem } from '../../services/notification';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getUserInfo } from '../../store/sessionStore';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';
import { objectNullOrEmpty } from '../../utils/utils';
import ModalCreateBarcodeDiscount from '../barcode-discount/modal-create-barcode-discount';
import { Action, BDStatus, DateFormat, TOStatus } from '../../utils/enum/common-enum';
import ModalCreateTransferOutDestroy from '../transfer-out-destroy/modal-create-transfer-out-destroy';
import ModalCreateTransferOut from '../transfer-out/modal-create-transfer-out';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { getTransferOutDetail } from '../../store/slices/transfer-out-detail-slice';
import { getBarcodeDiscountDetail } from '../../store/slices/barcode-discount-detail-slice';
import { ShoppingCartSharp } from '@mui/icons-material';

interface Props {
  refresh: boolean;
}

export default function NotificationTask(props: Props) {
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
      const rs = await getNotificationTasks(page);
      if (rs) {
        if (rs.data !== null) {
          setListData(rs.data);
          setTotal(rs.total);
        } else {
          setListData([]);
          setTotal(0);
        }
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
      if (item.type === 'SEND_TO_FOR_APPROVAL' || item.type === 'APPROVE_TRANSFER_OUT') {
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
      } else if (item.type === 'SEND_BD_FOR_APPROVAL' || item.type === 'APPROVE_BARCODE') {
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
    let newList = listData.map((el: any) => {
      if (el.id === id) {
        el.read = true;
        return el;
      } else return el;
    });
    setListData(newList);
    await updateNotificationItem(id);
  };

  const listTask = listData.map((item: any, index: number) => {
    const statusText =
      item.payload.status === TOStatus.APPROVED || item.payload.status == BDStatus.APPROVED ? 'อนุมัติ' : 'รออนุมัติ';
    let content;
    if (item.type === 'SEND_BD_FOR_APPROVAL' || item.type === 'APPROVE_BARCODE') {
      content = 'ส่วนลดสินค้า';
    } else {
      if (item.payload.type === 1) {
        content = 'เบิก-ใช้ในการทำกิจกรรม';
      } else {
        content = 'เบิก-ทำลายไม่มีส่วนลด';
      }
    }
    return (
      <Box
        key={index}
        sx={{
          borderTop: '1px solid #EAEBEB',
          minHeight: '60px',
          minWidth: '600px',
          cursor: 'pointer',
          backgroundColor: item.read ? 'transparent' : '#F6FFF3',
          fontSize: '12px',
        }}
        onClick={() => currentlySelected(item)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '98%' }}>
          <Box display={'flex'} mt={1} ml={1}>
            {item.type === 'SEND_BD_FOR_APPROVAL' || item.type === 'APPROVE_BARCODE' ? (
              <ShoppingCartSharp sx={{ color: theme.palette.primary.main, fontSize: '20px' }} />
            ) : (
              <PresentToAllIcon sx={{ color: theme.palette.primary.main, fontSize: '20px' }} />
            )}
            <span style={{ marginLeft: 15, color: theme.palette.primary.main }}>{content}</span>
            <span style={{ marginLeft: 5, marginRight: 3 }}>: {item.payload.documentNumber}</span> {'|'}
            <span style={{ marginLeft: 3 }}>
              {item.branchCode}-{item.payload.branchName}
            </span>
          </Box>
          <Box sx={{ textAlign: 'right', mt: '3px' }}>
            <Typography
              sx={{
                backgroundColor: '#E7FFE9',
                color: '#36C690',
                textAlign: 'center',
                marginTop: '5px',
                padding: '2px 15px 3px 15px',
                borderRadius: '8px',
                fontSize: '13px',
                width: '80px',
              }}
            >
              {statusText}
            </Typography>
          </Box>
        </Box>
        <Box ml={6}>
          <Typography style={{ color: theme.palette.grey[500], fontSize: '11px' }}>
            กำหนดดำเนินการ {moment(item.createdDate).add(543, 'y').format(DateFormat.DATE_FORMAT)}
          </Typography>
        </Box>
      </Box>
    );
  });
  return (
    <>
      <Card sx={{ height: '100%', border: '1px solid #E0E0E0', borderRadius: '10px', minWidth: '600px' }}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={10}
          rowsPerPageOptions={[]}
          sx={{ height: '40px', overflow: 'hidden' }}
        />
        <CardContent className={classes.MScrollBar} sx={{ height: '97%', overflowY: 'auto', mb: 1 }}>
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
