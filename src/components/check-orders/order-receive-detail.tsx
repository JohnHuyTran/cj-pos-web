import React from 'react';
import { useAppDispatch } from '../../store/store';
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
import {
  Entries,
  ItemsInfo,
  OrderReceiveApproveRequest,
  OrderReceiveDetailInfo,
} from '../../models/dc-check-order-model';
import { approveOrderReceive, searchOrderReceive } from '../../services/order-shipment';
import OrderReceiveDetailList from '../check-orders/order-receive-detail-list';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { getorderReceiveThStatus, getShipmentTypeText } from '../../utils/enum/check-order-enum';
import OrderReceiveConfirmModel from '../check-orders/order-receive-confirm-model';
import LoadingModal from '../commons/ui/loading-modal';

export interface OrderReceiveDetailProps {
  defaultOpen: boolean;
  onClickClose: any;
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

export default function OrderReceiveDetail({ defaultOpen, onClickClose }: OrderReceiveDetailProps) {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [open, setOpen] = React.useState(defaultOpen);

  const [values, setValues] = React.useState<State>({
    docNo: '',
  });

  const handleClose = () => {
    setOpen(false);
    onClickClose();
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const [orderReceiveRes, setOrderReceiveRes] = React.useState<Array<Entries>>([]);
  const [orderReceiveInfo, setOrderReceiveInfo] = React.useState<OrderReceiveDetailInfo>();
  const [sdNo, setSdNo] = React.useState('');
  const [docRefNo, setDocRefNo] = React.useState('');
  const [sdType, setSdtype] = React.useState(0);

  const handleSearch = async () => {
    handleOpenLoading('open', true);
    setFlagSearch(true);
    await searchOrderReceive(values.docNo)
      .then((value) => {
        setOrderReceiveRes(value.data.entries);
        setOrderReceiveInfo(value.data);
        setSdtype(value.data.sdType);
        setSdNo(value.data.sdNo);
        setDocRefNo(value.data.docRefNo);
      })
      .catch((error: any) => {
        console.log(error);
      });

    handleOpenLoading('open', false);
  };

  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);

  const handleApproveBtn = () => {
    setOpenModelConfirm(true);
  };

  const handleModelConfirm = () => {
    setOpenModelConfirm(false);
  };

  const handleConfirmStatus = async (status: string) => {
    if (status === 'ok') {
      let items: any = [];
      orderReceiveRes.forEach((data: any) => {
        const itemsNew: ItemsInfo = {
          barcode: data.barcode,
          actualQty: data.actualQty,
          comment: data.comment,
        };
        items.push(itemsNew);
      });

      const payload: OrderReceiveApproveRequest = {
        docRefNo: docRefNo,
        items: items,
      };

      await approveOrderReceive(payload);
      setOpen(false);
    } else {
      setOpen(false);
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
    if (orderReceiveRes.length > 0) {
      orderReceiveTable = <OrderReceiveDetailList entries={orderReceiveRes} />;
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
          <Typography sx={{ fontSize: '1em' }}>รับสินค้า</Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร:</Typography>
              </Grid>
              <Grid item lg={4}>
                {/* <Typography variant="body2">-</Typography> */}
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
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{sdNo ? sdNo : '-'}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">วันที่:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveInfo?.shipmentDate ? convertUtcToBkkDate(orderReceiveInfo?.shipmentDate) : '-'}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">สถานะ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveInfo?.status ? getorderReceiveThStatus(orderReceiveInfo?.status) : '-'}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">ประเภท:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{getShipmentTypeText(sdType)}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">สาขาต้นทาง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveInfo?.shipBranchFrom.name ? orderReceiveInfo?.shipBranchFrom.name : '-'}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">สาขาปลายทาง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {orderReceiveInfo?.shipBranchTo.name ? orderReceiveInfo?.shipBranchTo.name : '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {orderReceiveRes.length > 0 && (
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
            sdNo={sdNo}
            docRefNo={docRefNo}
          />

          <LoadingModal open={openLoadingModal.open} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
