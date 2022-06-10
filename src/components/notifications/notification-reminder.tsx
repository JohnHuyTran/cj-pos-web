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
import { getBranchName, objectNullOrEmpty } from '../../utils/utils';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';
import { getUserInfo } from '../../store/sessionStore';
import ModalCreateTransferOutDestroy from '../transfer-out-destroy/modal-create-transfer-out-destroy';
import ModalCreateTransferOut from '../transfer-out/modal-create-transfer-out';
import { ShoppingCartSharp } from '@mui/icons-material';
import HtmlTooltip from '../commons/ui/html-tooltip';
import AlertError from '../commons/ui/alert-error';

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
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
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
  const handleCloseModalError = () => {
    setOpenModalError(false);
  };

  const handleGetData = async () => {
    try {
      setOpenLoadingModal(true);
      const rs = await getNotificationReminders(page);
      if (rs && rs != 204) {
        if (rs.data) {
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
      if (item.type === 'REJECT_TRANSFER_OUT' || item.type === 'CLOSE_TRANSFER_OUT') {
        if (item.payload.type === 1) {
          const rs = await dispatch(getTransferOutDetail(item.documentNumber));
          if (!!rs.payload) {
            setOpenTransferOutDetail(true);
          } else {
            setOpenModalError(true);
          }
        } else if (item.payload.type === 2) {
          const rs = await dispatch(getTransferOutDetail(item.documentNumber));
          if (!!rs.payload) {
            setOpenTransferOutDestroyDetail(true);
          } else {
            setOpenModalError(true);
          }
        }
      } else if (item.type === 'REJECT_BARCODE') {
        const rs = await dispatch(getBarcodeDiscountDetail(item.payload._id));
        if (!!rs.payload) {
          setOpenBDDetail(true);
        } else {
          setOpenModalError(true);
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
    if (rs) {
      if (rs.data !== null) {
        setListData(rs.data);
        setTotal(rs.total);
      } else {
        setListData([]);
        setTotal(0);
      }
    }
  };
  const genStatusValue = (statusLabel: any, styleCustom: any) => {
    return (
      <HtmlTooltip title={<React.Fragment>{statusLabel}</React.Fragment>}>
        <Typography className={classes.MLabelBDStatus} sx={styleCustom}>
          {statusLabel}
        </Typography>
      </HtmlTooltip>
    );
  };

  const listTask = listData.map((item: any, index: number) => {
    let content, statusDisplay, branchCode;
    switch (item.type) {
      case 'REJECT_BARCODE':
        {
          content = 'ส่วนลดสินค้า';
          branchCode = item.payload.branchCode;
          statusDisplay = genStatusValue('ไม่อนุมัติ', {
            color: '#F76C6C',
            backgroundColor: '#FFD7D7',
          });
        }

        break;
      case 'CLOSE_TRANSFER_OUT':
        {
          if (item.payload.type === 1) {
            content = 'เบิก-ใช้ในการทำกิจกรรม';
          } else {
            content = 'เบิก-ทำลายไม่มีส่วนลด';
          }
          branchCode = item.payload.branchCode;
          statusDisplay = genStatusValue('ปิดงาน', {
            color: '#676767',
            backgroundColor: '#EAEBEB',
          });
        }

        break;
      case 'REJECT_TRANSFER_OUT':
        {
          if (item.payload.type === 1) {
            content = 'เบิก-ใช้ในการทำกิจกรรม';
          } else {
            content = 'เบิก-ทำลายไม่มีส่วนลด';
          }
          branchCode = item.payload.branchCode;
          statusDisplay = genStatusValue('ไม่อนุมัติ', {
            color: '#F76C6C',
            backgroundColor: '#FFD7D7',
          });
        }

        break;
      case 'EVENT_REQUEST_GENERATE_ORDER_SHIPMENT_ORDER_TOTE':
        {
          content = 'โอนสินค้าระหว่างสาขา - อยู่ระหว่างขนส่ง';
          branchCode = item.payload.branchCode;
          statusDisplay = genStatusValue('รับทราบ', {
            color: '#36C690',
            backgroundColor: '#E7FFE9',
          });
        }

        break;
    }
    return (
      <Box
        key={index}
        sx={{
          borderTop: '2px solid #EAEBEB',
          minHeight: '60px',
          backgroundColor: '#F6FFF3',
          minWidth: '600px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
        onClick={() => currentlySelected(item)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {item.type == 'REJECT_BARCODE' ? (
            <ShoppingCartSharp sx={{ color: theme.palette.primary.main, fontSize: '20px', mt: 1, ml: 1 }} />
          ) : (
            <PresentToAllIcon sx={{ color: theme.palette.primary.main, fontSize: '20px', mt: 1, ml: 1 }} />
          )}
          <Box
            sx={{
              mt: 1,
              ml: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '80%',
            }}
          >
            <span style={{ color: theme.palette.primary.main }}>{content}: </span>
            <HtmlTooltip
              title={
                <React.Fragment>
                  {item.documentNumber} | {branchCode}-{getBranchName(branchList, branchCode)}
                </React.Fragment>
              }
            >
              <span style={{ marginLeft: 5 }}>
                {item.documentNumber} | {branchCode}-{getBranchName(branchList, branchCode)}
              </span>
            </HtmlTooltip>
            <Box>
              <Typography style={{ color: theme.palette.grey[500], fontSize: '11px' }}>
                กำหนดดำเนินการ {moment(item.createdDate).add(543, 'y').format(DateFormat.DATE_FORMAT)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right', mt: '3px', pr: 2.5 }}>{statusDisplay}</Box>
        </Box>
      </Box>
    );
  });
  return (
    <>
      <Card
        sx={{
          height: '100%',
          border: '1px solid #E0E0E0',
          borderRadius: '10px',
          minWidth: '600px',
        }}
      >
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={10}
          rowsPerPageOptions={[]}
          sx={{ height: '40px', overflow: 'hidden' }}
        />
        <CardContent className={classes.MScrollBar} sx={{ height: '97%', overflowY: 'auto' }}>
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
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError={'เกิดข้อผิดพลาดระหว่างการดำเนินการ'}
      />
    </>
  );
}
