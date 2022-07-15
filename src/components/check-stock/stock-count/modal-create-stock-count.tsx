import React, { ReactElement, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useStyles } from '../../../styles/makeTheme';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  updateDataDetail,
  updateErrorList,
  updateCheckEdit,
} from '../../../store/slices/stock-count-slice';
import AlertError from '../../commons/ui/alert-error';
import { getBranchName, objectNullOrEmpty, stringNullOrEmpty } from '../../../utils/utils';
import { Action, StockActionStatus } from '../../../utils/enum/common-enum';
import ConfirmCloseModel from '../../commons/ui/confirm-exit-model';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import { ACTIONS } from "../../../utils/enum/permission-enum";
import { getUserInfo } from "../../../store/sessionStore";
import ModelConfirm from "../../barcode-discount/modal-confirm";
import {
  approveTransferOut,
  cancelTransferOut,
} from "../../../services/transfer-out";
import { updateCheckStock } from "../../../store/slices/stock-balance-check-slice";
import { updateAddItemsState } from "../../../store/slices/add-items-slice";
import StepperBar from "../../commons/ui/stepper-bar";
import { StepItem } from "../../../models/step-item-model";
import ModalStockCountItem from "./modal-stock-count-item";

interface Props {
  action: Action | Action.INSERT;
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  onClickClose: () => void;
  setPopupMsg?: any;
  onSearchMain?: () => void;
  userPermission?: any[];
}

const _ = require('lodash');

export default function ModalCreateStockCount({
  isOpen,
  onClickClose,
  setOpenPopup,
  action,
  setPopupMsg,
  onSearchMain,
  userPermission,
}: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  let errorListProduct: any = [];
  const [open, setOpen] = React.useState(isOpen);
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [openModalConfirmConfirm, setOpenModalConfirmConfirm] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('');

  const payloadStockCount = useAppSelector((state) => state.stockCountSlice.createDraft);
  const dataDetail = useAppSelector((state) => state.stockCountSlice.dataDetail);
  const checkEdit = useAppSelector((state) => state.stockCountSlice.checkEdit);
  const transferOutDetail = useAppSelector((state) => state.transferOutDetailSlice.transferOutDetail.data);
  //permission
  const [managePermission, setManagePermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
    ? userPermission.includes(ACTIONS.STOCK_SC_MANAGE) : false);
  const [alertTextError, setAlertTextError] = React.useState('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [currentBranch, setCurrentBranch] = React.useState((branchList && branchList.length > 0 && getUserInfo().branch)
    ? (getUserInfo().branch + ' - ' + getBranchName(branchList, getUserInfo().branch)) : '');

  const handleOpenCancel = () => {
    setOpenModalCancel(true);
  };

  const handleCloseModalCancel = () => {
    setOpenModalCancel(false);
  };

  const handleOpenModalConfirm = () => {
    setOpenModalConfirmConfirm(true);
  };

  const handleCloseModalConfirm = (confirm: boolean) => {
    setOpenModalConfirmConfirm(false);
    if (confirm) {
      setOpenModalConfirmConfirm(false);
      handleApprove();
    }
  };

  const handleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleCloseModalError = () => {
    setOpenModalError(false);
  };

  const handleClose = async () => {
    dispatch(updateErrorList([]));
    dispatch(updateCheckStock([]));
    dispatch(updateAddItemsState({}));
    dispatch(
      updateDataDetail({
        id: '',
        documentNumber: '',
        status: '',
        createdDate: moment(new Date()).toISOString(),
        branch: '',
        store: '',
        countingTime: '',
        apDocument: ''
      })
    );
    dispatch(updateCheckEdit(false));
    setOpen(false);
    onClickClose();
  };

  const handleCloseModalCreate = () => {
    if (checkEdit) {
      setOpenModalClose(true);
    } else if (dataDetail.status === StockActionStatus.DRAFT && checkEdit) {
      setOpenModalClose(true);
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    setStatus(dataDetail.status);
  }, [dataDetail.status]);

  useEffect(() => {
    //set value detail from search
    if (Action.UPDATE === action && !objectNullOrEmpty(transferOutDetail)) {
      //set value for data detail
      dispatch(
        updateDataDetail({
          id: transferOutDetail.id,
          documentNumber: transferOutDetail.documentNumber,
          status: transferOutDetail.status,
          createdDate: transferOutDetail.createdDate,
          approvedDate: transferOutDetail.approvedDate,
          transferOutReason: transferOutDetail.transferOutReason,
          store: transferOutDetail.store
        })
      );
      //set value for products
      if (transferOutDetail.products && transferOutDetail.products.length > 0) {
        let lstProductDetail: any = [];
        for (let item of transferOutDetail.products) {
          lstProductDetail.push({
            barcode: item.barcode,
            barcodeName: item.productName,
            unitName: item.unitName,
            unitCode: item.unitFactor,
            baseUnit: item.barFactor,
            unitPrice: item.price || 0,
            qty: item.numberOfRequested || 0,
            numberOfApproved: item.numberOfRequested || 0,
            skuCode: item.sku,
            remark: item.remark
          });
        }
        dispatch(updateAddItemsState(lstProductDetail));
      }
    }
  }, [transferOutDetail]);

  const validate = () => {
    let isValid = true;
    //validate product
    const data = [...payloadStockCount.products];
    if (data.length > 0) {
      let dt: any = [];
      for (let preData of data) {
        const item = {
          id: preData.barcode,
          errorNumberOfRequested: '',
        };
        if (preData.numberOfRequested <= 0 || !preData.numberOfRequested) {
          isValid = false;
          item.errorNumberOfRequested = 'จำนวนคำขอต้องมากกว่า 0';
        }
        if (!isValid) {
          dt.push(item);
        }
      }
      errorListProduct = dt;
    }
    if (!isValid) {
      dispatch(updateErrorList(errorListProduct));
      setOpenModalError(true);
    }
    return isValid;
  }

  const handleApprove = async () => {
    setAlertTextError('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
    try {
      const payload = {
        products: payloadStockCount.products,
      };
      const rs = await approveTransferOut(dataDetail.id, payload);
      if (rs.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: StockActionStatus.CONFIRM,
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ยืนยันตรวจนับสต๊อก (SC) เรียบร้อยแล้ว');
        handleClose();
        if (onSearchMain) onSearchMain();
      } else {
        setOpenModalError(true);
      }
    } catch (error) {
      setOpenModalError(true);
    }
  };

  const handleDeleteDraft = async () => {
    setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
    if (!stringNullOrEmpty(status)) {
      try {
        const rs = await cancelTransferOut(dataDetail.id);
        if (rs.status === 200) {
          setOpenPopup(true);
          setPopupMsg('คุณได้ยกเลิกตรวจนับสต๊อกเรียบร้อยแล้ว');
          handleClose();
          if (onSearchMain) onSearchMain();
        } else {
          setOpenModalError(true);
          setOpenModalCancel(false);
        }
      } catch (error) {
        setOpenModalError(true);
        setOpenModalCancel(false);
      }
    } else {
      setOpenPopup(true);
      setPopupMsg('คุณได้ยกเลิกตรวจนับสต๊อกเรียบร้อยแล้ว');
      handleClose();
    }
  };


  const steps: StepItem[] = [
    {
      value: StockActionStatus.DRAFT,
      label: 'บันทึก',
    },
    {
      value: StockActionStatus.CONFIRM,
      label: 'ยืนยัน',
    },
  ];

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseModalCreate}>
          <Typography sx={{ fontSize: '1em' }}>รายละเอียดตรวจนับสต๊อก (SC)</Typography>
          <StepperBar
            style={{ width: '20%', margin: 'auto', marginTop: '-1em' }}
            steps={steps}
            activeStep={status}
          />
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container mt={1} mb={-1}>
            {/*line 1*/}
            <Grid item container xs={4} mb={3}>
              <Grid item xs={4}>
                เลขที่เอกสาร :
              </Grid>
              <Grid item xs={8}>
                {!!dataDetail.documentNumber ? dataDetail.documentNumber : '-'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={3}>
              <Grid item xs={4}>
                วันที่สร้างรายการ :
              </Grid>
              <Grid item xs={8}>
                {moment(dataDetail.createdDate).add(543, 'y').format('DD/MM/YYYY')}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={3}>
              <Grid item xs={4}>
                <Typography>สาขาที่สร้าง</Typography>
                <Typography>รายการ :</Typography>
              </Grid>
              <Grid item xs={8}>
                {currentBranch}
              </Grid>
            </Grid>
            {/*line 2*/}
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                คลัง :
              </Grid>
              <Grid item xs={8}>
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                นับครั้งที่ :
              </Grid>
              <Grid item xs={8}>
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                เอกสาร AP :
              </Grid>
              <Grid item xs={8}>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Box sx={{ display: 'flex', marginBottom: '18px', justifyContent: 'flex-end' }}>
              <Button
                id='btnConfirm'
                variant='contained'
                color='primary'
                sx={{ margin: '0 17px' }}
                disabled={(!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT)
                  || (payloadStockCount.products && payloadStockCount.products.length === 0)}
                style={{ display: ((!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) || !managePermission) ? 'none' : undefined }}
                startIcon={<CheckCircleOutlineIcon/>}
                onClick={handleOpenModalConfirm}
                className={classes.MbtnSearch}>
                อนุมัติ
              </Button>
              <Button
                id='btnCancel'
                variant='contained'
                color='error'
                disabled={stringNullOrEmpty(status) || (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT)}
                style={{ display: ((!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) || !managePermission) ? 'none' : undefined }}
                startIcon={<HighlightOffIcon/>}
                onClick={handleOpenCancel}
                className={classes.MbtnSearch}>
                ยกเลิก
              </Button>
            </Box>
            <Box>
              <ModalStockCountItem action={action} userPermission={userPermission}/>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onConfirm={handleDeleteDraft}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันยกเลิกตรวจนับสต๊อก'}
        documentField={'เลขที่เอกสาร SC'}
      />
      <SnackbarStatus open={openPopupModal} onClose={handleClosePopup} isSuccess={true} contentMsg={textPopup}/>
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError={alertTextError}
      />
      <ConfirmCloseModel open={openModalClose} onClose={() => setOpenModalClose(false)} onConfirm={handleClose}/>
      <ModelConfirm
        open={openModalConfirmConfirm}
        onClose={() => handleCloseModalConfirm(false)}
        onConfirm={() => handleCloseModalConfirm(true)}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันตรวจนับสต๊อก (SC)'}
        documentField={'เลขที่เอกสาร SC'}
      />
    </div>
  );
}
