import React, { ReactElement, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
  DialogContent,
  Grid, Link,
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
import { objectNullOrEmpty, stringNullOrEmpty } from '../../../utils/utils';
import { Action, StockActionStatus, STORE_TYPE } from '../../../utils/enum/common-enum';
import ConfirmCloseModel from '../../commons/ui/confirm-exit-model';
import { ACTIONS } from "../../../utils/enum/permission-enum";
import ModelConfirm from "../../barcode-discount/modal-confirm";
import { updateCheckStock } from "../../../store/slices/stock-balance-check-slice";
import { updateAddItemsState } from "../../../store/slices/add-items-slice";
import StepperBar from "../../commons/ui/stepper-bar";
import { StepItem } from "../../../models/step-item-model";
import ModalStockCountItem from "./modal-stock-count-item";
import { getAuditPlanDetail } from "../../../store/slices/audit-plan-detail-slice";
import ModalCreateAuditPlan from "../audit-plan/audit-plan-create";
import { cancelStockCount, confirmStockCount } from "../../../services/stock-count";
import ModalConfirmSC from './modal-confirm-SC';
import { getUserInfo } from '../../../store/sessionStore';
import { isGroupBranch } from '../../../utils/role-permission';


interface Props {
  action: Action | Action.INSERT;
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  onClickClose: () => void;
  setPopupMsg?: any;
  onSearchMain?: () => void;
  userPermission?: any[];
  viewMode?: boolean;
}

interface loadingModalState {
  open: boolean;
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
  viewMode,
}: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  let errorListProduct: any = [];
  const [open, setOpen] = React.useState(isOpen);
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [openModalConfirmConfirm, setOpenModalConfirmConfirm] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>('');
  const payloadStockCount = useAppSelector((state) => state.stockCountSlice.createDraft);
  const dataDetail = useAppSelector((state) => state.stockCountSlice.dataDetail);
  const checkEdit = useAppSelector((state) => state.stockCountSlice.checkEdit);
  const stockCountDetail = useAppSelector((state) => state.stockCountDetailSlice.stockCountDetail.data);
  const userName = getUserInfo().preferred_username ? getUserInfo().preferred_username : '';
  //permission
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const [managePermission, setManagePermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
    ? userPermission.includes(ACTIONS.STOCK_SC_MANAGE) : false);
  const [alertTextError, setAlertTextError] = React.useState('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');

  const handleOpenCancel = () => {
    setOpenModalCancel(true);
  };

  const handleCloseModalCancel = () => {
    setOpenModalCancel(false);
  };

  const handleOpenModalConfirm = () => {
    if (!validate()) {
      setOpenModalError(true);
      setAlertTextError('กรุณาระบุจำนวนนับ');
      return;
    } else {

      setOpenModalConfirmConfirm(true);
    }
  };

  const handleCloseModalConfirm = (confirm: boolean) => {
    setOpenModalConfirmConfirm(false);
    if (confirm) {
      setOpenModalConfirmConfirm(false);
      handleConfirm();
    }
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
        createdBy: '',
        branch: '',
        storeType: '',
        countingTime: '',
        APDocumentNumber: '',
        APId: ''
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
    if (Action.UPDATE === action && !objectNullOrEmpty(stockCountDetail)) {
      //set value for data detail
      dispatch(
        updateDataDetail({
          id: stockCountDetail.id,
          documentNumber: stockCountDetail.documentNumber,
          status: stockCountDetail.status,
          createdDate: stockCountDetail.createdDate,
          createdBy: stockCountDetail.createdBy,
          countingTime: stockCountDetail.countingTime,
          APDocumentNumber: stockCountDetail.APDocumentNumber,
          APId: stockCountDetail.APId,
          storeType: stockCountDetail.storeType,
          branch: stockCountDetail.branchCode + ' - ' + stockCountDetail.branchName
        })
      );
      //set value for products
      if (stockCountDetail.product && stockCountDetail.product.length > 0) {
        let lstProductDetail: any = [];
        for (let item of stockCountDetail.product) {
          lstProductDetail.push({
            barcode: item.barcode,
            barcodeName: item.productName,
            unitName: item.unitName,
            unitCode: item.unitFactor,
            baseUnit: item.barFactor,
            unitPrice: item.price || 0,
            qty: item.quantity || null,
            skuCode: item.sku,
            canNotCount: item.canNotCount,
          });
        }
        dispatch(updateAddItemsState(lstProductDetail));
      }
    }
  }, [stockCountDetail]);

  const validate = () => {
    let isValid = true;
    //validate product
    const data = [...payloadStockCount.products];
    if (data.length > 0) {
      let dt: any = [];
      for (let preData of data) {
        const item = {
          id: preData.barcode,
          errorQuantity: '',
        };
        if (!preData.quantity && !preData.canNotCount && preData.quantity != 0) {
          isValid = false;
          item.errorQuantity = 'จำนวนคำขอต้องมากกว่า 0';
        }
        if (!isValid) {
          dt.push(item);
        }
      }
      errorListProduct = dt;
    }
    if (!isValid) {
      dispatch(updateErrorList(errorListProduct));
      // setOpenModalError(true);
    }
    return isValid;
  }

  const handleConfirm = async () => {
    setAlertTextError('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
    handleOpenLoading('open', true);
    try {
      const payload = {
        id: dataDetail.id,
        product: payloadStockCount.products,
      };
      const rs = await confirmStockCount(payload);
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
      } else if (rs.code == 40016){
        setOpenModalError(true);
        setAlertTextError('ไม่สามารถดำเนินการได้\nเนื่องจากเอกสาร AP ถูกยกเลิก');
      } else {
        setOpenModalError(true);
      }
    } catch (error) {
      setOpenModalError(true);
    }
    handleOpenLoading('open', false);
  };

  const handleCancel = async () => {
    setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
    if (!stringNullOrEmpty(status)) {
      try {
        const rs = await cancelStockCount(dataDetail.id);
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

  const genStoreType = (value: number) => {
    let valueDisplay = '';
    switch (value) {
      case STORE_TYPE.FRONT:
        valueDisplay = '001-หน้าร้าน';
        break;
      case STORE_TYPE.BACK:
        valueDisplay = '002-หลังร้าน';
        break;
    }
    return valueDisplay;
  };

  const [openDetailAP, setOpenDetailAP] = React.useState(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({ open: false });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };
  const auditPlanDetail = useAppSelector((state) => state.auditPlanDetailSlice.auditPlanDetail);
  const handleOpenAP = async () => {
    if (viewMode) return;
    handleOpenLoading('open', true);
    try {
      await dispatch(getAuditPlanDetail(dataDetail.APId));
      if (!objectNullOrEmpty(auditPlanDetail.data)) {
        setOpenDetailAP(true);
      }
    } catch (error) {
      console.log(error);
    }
    handleOpenLoading('open', false);
  };

  const handleOpenAddZero = () => {
    if (stockCountDetail.product && stockCountDetail.product.length > 0) {
      let newList = stockCountDetail.product.map((item: any) => {
        const sameItem = payloadStockCount.products.find((el: any) => el.barcode == item.barcode);
        return {
          barcode: item.barcode,
          barcodeName: item.productName,
          unitName: item.unitName,
          unitCode: item.unitFactor,
          baseUnit: item.barFactor,
          unitPrice: item.price || 0,
          skuCode: item.sku,
          canNotCount: sameItem.canNotCount,
          qty: (!sameItem.quantity && !sameItem.canNotCount) ? 0 : sameItem.quantity,
        };
      });
      dispatch(updateErrorList([]));
      dispatch(updateAddItemsState(newList));
    }
  };

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
                {dataDetail.branch}
              </Grid>
            </Grid>
            {/*line 2*/}
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                คลัง :
              </Grid>
              <Grid item xs={8}>
                {genStoreType(dataDetail.storeType)}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                นับครั้งที่ :
              </Grid>
              <Grid item xs={8}>
                {dataDetail.countingTime}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                เอกสาร AP :
              </Grid>
              <Grid item xs={8}>
                <Link color={'secondary'} component={'button'} variant={'subtitle1'} underline={'always'} onClick={handleOpenAP}>
                  {dataDetail.APDocumentNumber}
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Box sx={{ display: 'flex', marginBottom: '18px' }}>
                <Button
                  id="btnAddZero"
                  variant="contained"
                  color="info"
                  className={classes.MbtnSearch}
                  onClick={handleOpenAddZero}
                  sx={{ width: 172 }}
                  style={{
                    display:
                      userName != 'posaudit' ? 'none' : undefined,
                  }}>
                  คลิกใส่ 0 สินค้าที่ไม่พบ
                </Button>
            
            <Box sx={{ marginLeft: 'auto' }}>
              <Button
                id='btnConfirm'
                variant='contained'
                color='primary'
                sx={{ margin: '0 17px' }}
                disabled={(!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT)
                  || (payloadStockCount.products && payloadStockCount.products.length === 0)}
                style={{
                  display:
                    (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) ||
                    !managePermission ||
                    !groupBranch
                      ? 'none'
                      : undefined,
                }}
                startIcon={<CheckCircleOutlineIcon/>}
                onClick={handleOpenModalConfirm}
                className={classes.MbtnSearch}>
                ยืนยัน
              </Button>
              <Button
                id='btnCancel'
                variant='contained'
                color='error'
                disabled={stringNullOrEmpty(status)}
                style={{ display: !managePermission || !groupBranch ? 'none' : undefined }}
                startIcon={<HighlightOffIcon/>}
                onClick={handleOpenCancel}
                className={classes.MbtnSearch}>
                ยกเลิก
              </Button>
            </Box>
            </Box>
            <Box>
              <ModalStockCountItem action={action} userPermission={userPermission} viewMode={viewMode}/>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {openDetailAP && (
        <ModalCreateAuditPlan
          isOpen={openDetailAP}
          onClickClose={() => {
            setOpenDetailAP(false)
          }}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          userPermission={userPermission}
          viewMode={true}
        />
      )}
      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onConfirm={handleCancel}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันยกเลิกตรวจนับสต๊อก'}
        documentField={'เลขที่เอกสาร SC'}
      />
      <ModalConfirmSC open={openModalConfirmConfirm} onClose={() => handleCloseModalConfirm(false)} onConfirm={handleConfirm} />
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError={alertTextError}
      />
      <ConfirmCloseModel open={openModalClose} onClose={() => setOpenModalClose(false)} onConfirm={handleClose}/>
    </div>
  );
}
