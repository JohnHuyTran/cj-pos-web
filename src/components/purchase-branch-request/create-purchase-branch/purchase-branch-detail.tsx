import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Box, Button, DialogTitle, Grid, IconButton } from '@mui/material';
import { AddCircleOutlineOutlined, Cancel, CheckCircle, HighlightOff, Save } from '@mui/icons-material';
import Steppers from '../../commons/ui/steppers';
import moment from 'moment';
import { useStyles } from '../../../styles/makeTheme';
import PurchaseBranchListItem from './purchase-branch-list-item';
import TextBoxComment from '../../commons/ui/textbox-comment';
import ModalAddItems from '../../commons/ui/modal-add-items';
import { getBranchName } from '../../../utils/utils';
import { getUserInfo } from '../../../store/sessionStore';
import { PurchaseBRRequest } from '../../../models/purchase-branch-request-model';
import { deletePurchaseBR, savePurchaseBR } from '../../../services/purchase';
import { ApiError } from '../../../models/api-error-model';
import { updateAddItemsState } from '../../../store/slices/add-items-slice';
import LoadingModal from '../../commons/ui/loading-modal';
import { getPurchaseBranchList } from '../../../utils/enum/purchase-branch-enum';
import ModelConfirm from '../modal-confirm';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import { ACTIONS } from '../../../utils/enum/permission-enum';
import { isAllowActionPermission } from '../../../utils/role-permission';
import ConfirmModelExit from '../../commons/ui/confirm-exit-model';
import { featchSearchPurchaseBranchRequestAsync } from '../../../store/slices/purchase-branch-request-slice';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}>
          <HighlightOff fontSize='large' />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function purchaseBranchDetail({ isOpen, onClickClose }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const { t } = useTranslation(['purchaseBranch', 'common']);
  const [open, setOpen] = React.useState(isOpen);
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);

  const [flagSave, setFlagSave] = React.useState(false);
  const handleChkSaveClose = async () => {
    if (flagSave) {
      setConfirmModelExit(true);
    } else {
      handleClose();
    }
  };

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  const [confirmModelExit, setConfirmModelExit] = React.useState(false);
  const handleNotExitModelConfirm = () => {
    setConfirmModelExit(false);
  };
  const handleExitModelConfirm = () => {
    handleClose();
  };

  const purchaseBRDetail = useAppSelector((state) => state.purchaseBRDetailSlice.purchaseBRDetail.data);
  const [docNo, setDocNo] = React.useState('');
  const [remark, setRemark] = React.useState('');
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [status, setStatus] = React.useState('');
  const [branchName, setBranchName] = React.useState('');
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  const [displayBtnSubmit, setDisplayBtnSubmit] = React.useState(false);
  const [displayBtnSave, setDisplayBtnSave] = React.useState(false);
  const [displayBtnDelete, setDisplayBtnDelete] = React.useState(false);
  const [displayAddItems, setDisplayAddItems] = React.useState(false);

  useEffect(() => {
    if (status !== 'DRAFT' && isAllowActionPermission(ACTIONS.PURCHASE_BR_MANAGE)) {
      setDisplayBtnDelete(true);
    } else {
      setDisplayBtnDelete(false);
    }
    setDisplayBtnSubmit(isAllowActionPermission(ACTIONS.PURCHASE_BR_MANAGE));
    setDisplayBtnSave(isAllowActionPermission(ACTIONS.PURCHASE_BR_MANAGE));
    // setDisplayBtnDelete(isAllowActionPermission(ACTIONS.PURCHASE_BR_MANAGE));
    setDisplayAddItems(isAllowActionPermission(ACTIONS.PURCHASE_BR_MANAGE));

    if (purchaseBRDetail) {
      setDocNo(purchaseBRDetail.docNo);
      setStatus(purchaseBRDetail.status);
      handleStatusStepper(purchaseBRDetail.status);
      setRemark(purchaseBRDetail.remark);
      setCreateDate(new Date(purchaseBRDetail.createdDate));

      const strBranchName = getBranchName(branchList, purchaseBRDetail.branchCode);
      setBranchName(strBranchName ? `${purchaseBRDetail.branchCode}-${strBranchName}` : getUserInfo().branch);

      if (purchaseBRDetail.items.length > 0) {
        let items: any = [];
        purchaseBRDetail.items.forEach((data: any) => {
          const item: any = {
            skuCode: data.skuCode,
            barcode: data.barcode,
            barcodeName: data.barcodeName,
            unitCode: data.unitCode,
            unitName: data.unitName,
            baseUnit: data.barFactor,
            qty: data.orderQty,
            stockMax: data.orderMaxQty,
          };
          items.push(item);
        });

        dispatch(updateAddItemsState(items));
      }
    } else {
      const strBranchName = getBranchName(branchList, getUserInfo().branch);
      setBranchName(strBranchName ? `${getUserInfo().branch}-${strBranchName}` : getUserInfo().branch);
      handleStatusStepper('DRAFT');
    }
  }, [branchList]);

  const [steps, setSteps] = React.useState([]);
  const [statusSteps, setStatusSteps] = React.useState(0);
  const stepsList: any = [];
  const handleStatusStepper = async (status: string) => {
    getPurchaseBranchList().map((item) => {
      if (item.stepperGrp === 1 && item.value === status) {
        stepsList.push(t(`status.${item.value}`));
        stepsList.push('อยู่ระหว่างดำเนินการ: -');
        stepsList.push(t(`status.CLOSED`));
        setStatusSteps(item.stepperGrp - 1);
      } else if (item.stepperGrp === 2 && item.value === status) {
        stepsList.push(t('status.DRAFT'));
        stepsList.push('อยู่ระหว่างดำเนินการ: ' + t(`status.${item.value}`));
        stepsList.push(t(`status.CLOSED`));
        setStatusSteps(item.stepperGrp - 1);
      } else if (item.stepperGrp === 3 && item.value === status) {
        stepsList.push(t('status.DRAFT'));
        stepsList.push('อยู่ระหว่างดำเนินการ: -');
        stepsList.push(t(`status.${item.value}`));
        setStatusSteps(item.stepperGrp - 1);
      }
      //setSteps
      setSteps(stepsList);
    });
  };

  const handleChangeComment = (value: any) => {
    setFlagSave(true);
    setRemark(value);
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleModelCloseAddItems = async () => {
    if (Object.keys(payloadAddItem).length !== 0) setFlagSave(true);
    setOpenModelAddItems(false);
  };
  const handleChangeItems = async () => {
    setFlagSave(true);
    // await dispatch(updateAddItemsState(items));
  };

  const handleSaveBR = async () => {
    setOpenLoadingModal(true);
    const payloadSave: any = await handleMapPayloadSave();
    await savePurchaseBR(payloadSave)
      .then((value) => {
        setDocNo(value.docNo);
        setStatus('DRAFT');

        setFlagSave(false);
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
      })
      .catch((error: ApiError) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(false);
        setContentMsg(error.message);
      });
    setOpenLoadingModal(false);
  };

  const handleMapPayloadSave = async () => {
    const items: any = [];
    if (Object.keys(payloadAddItem).length > 0) {
      await payloadAddItem.forEach((data: any) => {
        const item: any = {
          barcode: data.barcode,
          orderMaxQty: data.stockMax ? data.stockMax : 0,
          orderQty: data.qty ? data.qty : 0,
        };
        items.push(item);
      });
    }

    if (docNo !== '') {
      const payload: PurchaseBRRequest = {
        docNo: docNo,
        remark: remark,
        items: items,
      };

      return await payload;
    } else {
      const payload: PurchaseBRRequest = {
        remark: remark,
        items: items,
      };

      return await payload;
    }
  };

  const [openModalConfirmDelete, setOpenModalConfirmDelete] = React.useState<boolean>(false);
  const handleOpenConfirm = async () => {
    setOpenModalConfirmDelete(true);
  };
  const handleCloseModalConfirm = () => {
    setOpenModalConfirmDelete(false);
  };

  const payLoadSearch = useAppSelector((state) => state.saveSearchPurchaseBranchRequest.searchPurchaseBranchRequest);
  const handleDeletePurchaseBR = async () => {
    handleCloseModalConfirm();
    setOpenLoadingModal(true);
    await deletePurchaseBR(docNo)
      .then((value) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(true);
        setContentMsg('คุณได้ยกเลิกข้อมูลเรียบร้อยแล้ว');

        dispatch(featchSearchPurchaseBranchRequestAsync(payLoadSearch));

        setTimeout(() => {
          handleClose();
        }, 300);
      })
      .catch((error: ApiError) => {
        setShowSnackBar(true);
        setSnackbarIsStatus(false);
        setContentMsg(error.message);
      });
    setOpenLoadingModal(false);
  };

  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = React.useState(false);
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleChkSaveClose}>
          <Typography sx={{ fontSize: '1em' }}>สร้างรายการสั่งสินค้า</Typography>
          <Steppers status={statusSteps} stepsList={steps}></Steppers>
        </BootstrapDialogTitle>

        <DialogContent>
          <Grid container spacing={2} mb={2} id='top-item'>
            <Grid item xs={2}>
              เลขที่เอกสาร BR :
            </Grid>
            <Grid item xs={4}>
              {docNo !== '' && docNo}
              {docNo === '' && '-'}
            </Grid>
            <Grid item xs={2}>
              วันที่สร้างรายการ :
            </Grid>
            <Grid item xs={4}>
              {moment(createDate).add(543, 'y').format('DD/MM/YYYY')}
            </Grid>
          </Grid>

          <Grid container spacing={2} mb={2} id='top-item'>
            <Grid item xs={2}>
              สาขาที่สร้างรายการ :
            </Grid>
            <Grid item xs={4}>
              {branchName}
            </Grid>
            <Grid item xs={2}>
              สถานะ :
            </Grid>
            <Grid item xs={4}>
              {status !== '' && t(`status.${status}`)}
              {status === '' && '-'}
            </Grid>
          </Grid>

          <Box mb={6}>
            <Grid container spacing={2} mt={4} mb={2}>
              <Grid item xs={5}>
                <Button
                  id='btnCreateStockTransferModal'
                  variant='contained'
                  onClick={handleOpenAddItems}
                  sx={{ width: 120, display: `${displayAddItems ? 'none' : ''}` }}
                  className={classes.MbtnAdd}
                  startIcon={<AddCircleOutlineOutlined />}
                  color='secondary'>
                  เพิ่มสินค้า
                </Button>
              </Grid>
              <Grid item xs={7} sx={{ textAlign: 'end' }}>
                <Button
                  id='btnCreateStockTransferModal'
                  variant='contained'
                  onClick={handleSaveBR}
                  sx={{ width: 120, display: `${displayBtnSave ? 'none' : ''}` }}
                  className={classes.MbtnAdd}
                  startIcon={<Save />}
                  color='warning'
                  disabled={Object.keys(payloadAddItem).length === 0}>
                  บันทึก
                </Button>
                <Button
                  id='btnClear'
                  variant='contained'
                  // onClick={onClickSubmitBtn}
                  sx={{ width: 120, ml: 2, display: `${displayBtnSubmit ? 'none' : ''}` }}
                  className={classes.MbtnClear}
                  startIcon={<CheckCircle />}
                  color='primary'
                  // disabled={Object.keys(payloadAddItem).length === 0}
                  disabled={true}>
                  ส่งรายการ
                </Button>
                <Button
                  id='btnSearch'
                  variant='contained'
                  onClick={handleOpenConfirm}
                  sx={{ width: 120, ml: 2, display: `${displayBtnDelete ? 'none' : ''}` }}
                  startIcon={<Cancel />}
                  className={classes.MbtnSearch}
                  color='error'
                  disabled={Object.keys(payloadAddItem).length === 0}>
                  ยกเลิก
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box mb={5}>
            <PurchaseBranchListItem onChangeItems={handleChangeItems} />
          </Box>
          <Box mb={8}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={3}>
                <TextBoxComment
                  fieldName='หมายเหตุ :'
                  defaultValue={remark}
                  maxLength={100}
                  onChangeComment={handleChangeComment}
                  isDisable={false}
                />
              </Grid>
            </Grid>
          </Box>

          <ModalAddItems
            open={openModelAddItems}
            onClose={handleModelCloseAddItems}
            requestBody={{
              skuCodes: [],
              skuTypes: [3, 6],
              isOrderable: true,
            }}></ModalAddItems>

          <LoadingModal open={openLoadingModal} />

          <ModelConfirm
            open={openModalConfirmDelete}
            onClose={handleCloseModalConfirm}
            onConfirm={handleDeletePurchaseBR}
            headerTitle={'ยืนยันยกเลิกสั่งสินค้าสาขา'}
            docNo={docNo}
          />

          <SnackbarStatus
            open={showSnackBar}
            onClose={handleCloseSnackBar}
            isSuccess={snackbarIsStatus}
            contentMsg={contentMsg}
          />

          <ConfirmModelExit
            open={confirmModelExit}
            onClose={handleNotExitModelConfirm}
            onConfirm={handleExitModelConfirm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default purchaseBranchDetail;
