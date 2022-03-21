import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { HighlightOff, CheckCircleOutline, SearchOff } from '@mui/icons-material';
import { useStyles } from '../../styles/makeTheme';
import SearchIcon from '@mui/icons-material/Search';
import { ItemsInfo, OrderReceiveApproveRequest } from '../../models/dc-check-order-model';
import { approveOrderReceive } from '../../services/order-shipment';
import OrderReceiveDetailList from '../check-orders/order-receive-detail-list';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { getorderReceiveThStatus, getShipmentTypeText } from '../../utils/enum/check-order-enum';
import OrderReceiveConfirmModel from '../check-orders/order-receive-confirm-model';
import LoadingModal from '../commons/ui/loading-modal';
import { searchOrderReceiveAsync } from '../../store/slices/order-receive-slice';

export interface OrderReceiveDetailProps {
  defaultOpen: boolean;
  onClickClose: any;
  isTote?: boolean;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

interface State {
  docNo: string;
}
interface loadingModalState {
  open: boolean;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}
        >
          <HighlightOff fontSize="large" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function OrderReceiveDetail({ defaultOpen, onClickClose, isTote }: OrderReceiveDetailProps) {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const orderReceiveResp = useAppSelector((state) => state.orderReceiveSlice.orderReceiveList);
  const orderReceiveData = orderReceiveResp.data ? orderReceiveResp.data : {};
  const orderReceiveEntries = orderReceiveData.entries;
  const orderDetails = useAppSelector((state) => state.checkOrderDetail.orderDetail);
  const orderDetail: any = orderDetails.data ? orderDetails.data : null;
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  const [isTotes, setIsTotes] = React.useState(isTote);
  const [open, setOpen] = React.useState(defaultOpen);
  const [values, setValues] = React.useState<State>({
    docNo: '',
  });

  const handleClose = async () => {
    await dispatch(searchOrderReceiveAsync());
    setOpen(false);
    onClickClose();
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const handleSearch = async () => {
    handleOpenLoading('open', true);
    setFlagSearch(true);

    await dispatch(searchOrderReceiveAsync(values.docNo));
    handleOpenLoading('open', false);
  };

  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);
  const handleApproveBtn = () => {
    setOpenModelConfirm(true);
  };

  const handleModelConfirm = async () => {
    await dispatch(searchOrderReceiveAsync(''));
    setOpenModelConfirm(false);
  };

  const handleConfirmStatus = async (status: string) => {
    if (status === 'ok') {
      handleOpenLoading('open', true);
      let items: any = [];
      orderReceiveEntries.forEach((data: any) => {
        const itemsNew: ItemsInfo = {
          barcode: data.barcode,
          actualQty: data.actualQty,
          comment: data.comment,
        };
        items.push(itemsNew);
      });
      const payload: OrderReceiveApproveRequest = {
        docRefNo: orderReceiveData.docRefNo,
        items: items,
      };

      await approveOrderReceive(payload);
      await dispatch(searchOrderReceiveAsync());
      setOpen(false);
      onClickClose();
      handleOpenLoading('open', false);
    } else {
      await dispatch(searchOrderReceiveAsync());
      setOpen(false);
      onClickClose();
    }
  };

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  let orderReceiveTable;
  const [flagSearch, setFlagSearch] = React.useState(false);
  if (flagSearch) {
    if (Object.keys(orderReceiveData).length > 0) {
      orderReceiveTable = <OrderReceiveDetailList />;
    } else {
      orderReceiveTable = (
        <Grid item container xs={12} justifyContent="center">
          <Box color="#CBD4DB">
            <h2>
              ไม่มีข้อมูล <SearchOff fontSize="large" />
            </h2>
          </Box>
        </Grid>
      );
    }
  }

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {isTotes && <Typography sx={{ fontSize: '1em' }}>รับสินค้าใน Tote</Typography>}
          {!isTotes && <Typography sx={{ fontSize: '1em' }}>รับสินค้า</Typography>}
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร:</Typography>
              </Grid>
              <Grid item lg={4}>
                {isTotes && (
                  <Typography variant="body2">{orderDetail.docRefNo ? orderDetail.docRefNo : '-'}</Typography>
                )}
                {!isTotes && (
                  <>
                    <TextField
                      id="txtDocNo"
                      name="docNo"
                      size="small"
                      value={values.docNo}
                      onChange={handleChange}
                      className={classes.MtextField}
                      placeholder="เลขที่เอกสาร LD/BT"
                    />

                    <IconButton color="primary" component="span" onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{orderReceiveData.sdNo ? orderReceiveData.sdNo : '-'}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">วันที่:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveData.shipmentDate ? convertUtcToBkkDate(orderReceiveData.shipmentDate) : '-'}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">สถานะ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveData.status ? getorderReceiveThStatus(orderReceiveData.status) : '-'}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">ประเภท:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{getShipmentTypeText(orderReceiveData.sdType)}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">สาขาต้นทาง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveData.shipBranchFrom ? orderReceiveData.shipBranchFrom.code : ''}-
                  {orderReceiveData.shipBranchFrom ? orderReceiveData.shipBranchFrom.name : ''}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">สาขาปลายทาง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveData.shipBranchTo ? orderReceiveData.shipBranchTo.code : ''}-
                  {orderReceiveData.shipBranchTo ? orderReceiveData.shipBranchTo.name : ''}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {Object.keys(orderReceiveData).length > 0 && (
            <Box sx={{ marginTop: 4 }}>
              <Grid item container spacing={2} justifyContent="flex-end">
                <Button
                  id="btnApprove"
                  variant="contained"
                  color="primary"
                  className={classes.MbtnApprove}
                  onClick={handleApproveBtn}
                  startIcon={<CheckCircleOutline />}
                  sx={{ width: '15%' }}
                >
                  ยืนยัน
                </Button>
              </Grid>
            </Box>
          )}

          {orderReceiveTable}

          <OrderReceiveConfirmModel
            open={openModelConfirm}
            onClose={handleModelConfirm}
            onUpdateAction={handleConfirmStatus}
            sdNo={orderReceiveData.sdNo}
            docRefNo={orderReceiveData.docRefNo}
          />

          <LoadingModal open={openLoadingModal.open} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
