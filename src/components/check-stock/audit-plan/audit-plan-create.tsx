import React, { ReactElement, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Button, Dialog, DialogContent, Grid, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import { useStyles } from '../../../styles/makeTheme';
import StepperBar from './stepper-bar';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import AlertError from '../../commons/ui/alert-error';
import { getBranchName, objectNullOrEmpty, onChangeDate, stringNullOrEmpty } from '../../../utils/utils';
import { Action, StockActionStatus } from '../../../utils/enum/common-enum';
import ConfirmCloseModel from '../../commons/ui/confirm-exit-model';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import { ACTIONS } from '../../../utils/enum/permission-enum';
import { getUserInfo } from '../../../store/sessionStore';
import ModelConfirm from '../../barcode-discount/modal-confirm';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import { BranchListOptionType } from '../../../models/branch-model';
import { isGroupBranch } from '../../../utils/role-permission';
import ModalAddTypeProduct from '../../commons/ui/modal-add-type-products';
import AuditPlanCreateItem from './audit-plan-create-item';
import ModalConfirmCouting from './modal-confirm-couting';
import { confirmAuditPlan, coutingAuditPlan, saveDraftAuditPlan } from '../../../services/audit-plan';
import { updateAddTypeAndProductState } from '../../../store/slices/add-type-product-slice';
import { PayloadCouting } from '../../../models/audit-plan';
import { clearDataFilter } from '../../../store/slices/audit-plan-detail-slice';

interface Props {
  action: Action | Action.INSERT;
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  onClickClose: () => void;
  setPopupMsg?: any;
  onSearchMain?: () => void;
  userPermission?: any[];
}

interface Values {
  id: string;
  countingDate: Date | null | any;
  branch: string;
  documentNumber: string;
  createDate: Date | null | any;
}

const _ = require('lodash');

const steps = [StockActionStatus.DRAFT, StockActionStatus.CONFIRM, StockActionStatus.COUNTING, StockActionStatus.END];

export default function ModalCreateAuditPlan({
  isOpen,
  onClickClose,
  setOpenPopup,
  setPopupMsg,
  onSearchMain,
  userPermission,
  action,
}: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(isOpen);
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = React.useState<boolean>(false);
  const [openModelAddItems, setOpenModelAddItems] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<any>('');
  const [errors, setErrors] = React.useState<any>([]);
  const [openModalConfirmCouting, setOpenModalConfirmCouting] = React.useState<boolean>(false);

  const [textErrors, setTextErrors] = React.useState({
    dateError: '',
    branchError: '',
  });

  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [ownBranch, setOwnBranch] = React.useState(
    getUserInfo().branch ? (getBranchName(branchList, getUserInfo().branch) ? getUserInfo().branch : '') : ''
  );
  const branchName = getBranchName(branchList, ownBranch);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [branchMap, setBranchMap] = React.useState<BranchListOptionType>({
    code: ownBranch,
    name: branchName ? branchName : '',
  });
  const [branchOptions, setBranchOptions] = React.useState<BranchListOptionType | null>(groupBranch ? branchMap : null);

  const [values, setValues] = React.useState<Values>({
    id: '',
    countingDate: null,
    branch: groupBranch ? ownBranch : '',
    documentNumber: '',
    createDate: new Date(),
  });
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  const [checkEdit, updateCheckEdit] = React.useState(false);
  //permission
  const userInfo = getUserInfo();
  const managePermission =
    userInfo.acl['service.posback-stock'] != null && userInfo.acl['service.posback-stock'].length > 0
      ? userInfo.acl['service.posback-stock'].includes('stock.ap.manage')
      : false;
  const payloadAddTypeProduct = useAppSelector((state) => state.addTypeAndProduct.state);
  const [alertTextError, setAlertTextError] = React.useState('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');

  const dataDetail = useAppSelector((state) => state.auditPlanDetailSlice.auditPlanDetail.data);

  useEffect(() => {
    if ((payloadAddItem.length == 0 && steps.indexOf(status) < 1) || steps.indexOf(status) >= 1) {
      updateCheckEdit(false);
    } else {
      updateCheckEdit(true);
    }
  }, [payloadAddItem, status]);

  useEffect(() => {
    if (steps.indexOf(status) < 1) {
      if (values.branch && !groupBranch) {
        setTextErrors({ ...textErrors, branchError: '' });
      }
      if (values.countingDate) {
        setTextErrors({ ...textErrors, dateError: '' });
      }
    }
  }, [values.branch, values.countingDate]);
  useEffect(() => {
    if (Action.UPDATE === action && !objectNullOrEmpty(dataDetail)) {
      setStatus(dataDetail.status);
      setValues({
        id: dataDetail.id,
        branch: dataDetail.branchCode,
        documentNumber: dataDetail.documentNumber,
        createDate: dataDetail.createdDate,
        countingDate: dataDetail.countingDate,
      });
      const products = dataDetail.product
        ? dataDetail.product.map((item: any) => {
            return {
              barcodeName: item.name,
              skuCode: item.sku,
              selectedType: 2,
            };
          })
        : [];
      dispatch(updateAddTypeAndProductState(products));
    }
  }, [dataDetail]);
  const handleChangeBranch = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branch: JSON.parse(codes) });
    } else {
      setValues({ ...values, branch: '' });
    }
  };

  const handleCloseModalConfirmCouting = () => {
    setOpenModalConfirmCouting(false);
  };

  const handleCouting = async (store: number) => {
    try {
      const products = payloadAddTypeProduct
        .filter((el: any) => el.selectedType === 2)
        .map((item: any) => {
          return {
            name: item.barcodeName,
            sku: item.skuCode,
            unitName: item.unitName,
            barcode: item.barcode,
          };
        });
      const payload: PayloadCouting = {
        auditPlanning: {
          product: products,
          documentNumber: values.documentNumber,
          branchCode: values.branch,
          branchName: getBranchName(branchList, values.branch),
        },
        storeType: store,
      };
      const rs = await coutingAuditPlan(payload);
      if (rs.code == 20000) {
        updateCheckEdit(false);
        // setOpenPopupModal(true);
        // setTextPopup('คุณได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว');

        setStatus(StockActionStatus.COUNTING);
      } else {
        setOpenModalError(true);
      }
    } catch (error) {}
  };

  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };

  const handleCloseModalAddItems = async () => {
    setOpenModelAddItems(false);
  };

  const handleOpenCancel = () => {
    setOpenModalCancel(true);
  };

  const handleCloseModalCancel = () => {
    setOpenModalCancel(false);
  };

  const handleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleCloseModalError = () => {
    setOpenModalError(false);
  };

  const handleClose = async () => {
    dispatch(updateAddTypeAndProductState([]));
    dispatch(clearDataFilter());
    setOpen(false);
    onClickClose();
  };

  const handleCloseModalCreate = () => {
    if ((status === '' && Object.keys(payloadAddItem).length) || checkEdit) {
      setOpenModalClose(true);
    } else if (status === StockActionStatus.DRAFT && checkEdit) {
      setOpenModalClose(true);
    } else {
      handleClose();
    }
  };

  const validate = () => {
    let isValid = true;
    //validate data detail
    if (stringNullOrEmpty(values.branch)) {
      isValid = false;
      setTextErrors({
        ...textErrors,
        branchError: 'กรุณาระบุรายละเอียด',
      });
    }
    if (stringNullOrEmpty(values.countingDate)) {
      isValid = false;
      setTextErrors({
        ...errors,
        dateError: 'กรุณาระบุรายละเอียด',
      });
    }
    return isValid;
  };

  const handleCreateDraft = async () => {
    if (validate()) {
      try {
        const products = payloadAddTypeProduct
          .filter((el: any) => el.selectedType === 2)
          .map((item: any) => {
            return {
              name: item.barcodeName,
              sku: item.skuCode,
              unitName: item.unitName,
              barcode: item.barcode,
            };
          });
        const body = !!values.id
          ? {
              id: values.id,
              branchCode: values.branch,
              branchName: getBranchName(branchList, values.branch),
              countingDate: moment(values.countingDate).toISOString(true),
              product: products,
            }
          : {
              branchCode: values.branch,
              branchName: getBranchName(branchList, values.branch),
              countingDate: moment(values.countingDate).toISOString(true),
              product: products,
            };
        const rs = await saveDraftAuditPlan(body);
        if (rs.code === 20000) {
          updateCheckEdit(false);
          setOpenPopupModal(true);
          setTextPopup('คุณได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว');
          setValues({
            ...values,
            id: rs.data.id,
            documentNumber: rs.data.documentNumber,
          });
          setStatus(StockActionStatus.DRAFT);
        } else {
          setOpenModalError(true);
        }
      } catch (error) {
        setOpenModalError(true);
      }
    }
  };

  const handleConfirm = async () => {
    if (status == StockActionStatus.DRAFT) {
      setOpenModalConfirm(true);
    } else {
      setOpenModalConfirmCouting(true);
    }
  };

  const handleOpenModalConfirm = () => {
    setOpenModalConfirm(true);
  };

  const handleCloseModalConfirm = async (confirm: boolean) => {
    setOpenModalConfirm(false);
    if (confirm) {
      try {
        const rs = await confirmAuditPlan(values.id);
        if (rs.code == 20000) {
          setStatus(StockActionStatus.CONFIRM);
          updateCheckEdit(false);
          setOpenPopupModal(true);
          setTextPopup('คุณได้ทำการสร้างแผนตรวจนับสต๊อกเรียบร้อยแล้ว');
          handleClose();
          if (onSearchMain) onSearchMain();
        }
      } catch (error) {}
    }
  };

  const handleDeleteDraft = async () => {
    setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
    if (!stringNullOrEmpty(status)) {
      // try {
      //   const rs = await cancelTransferOut(values.id);
      //   if (rs.status === 200) {
      //     setOpenPopup(true);
      //     setPopupMsg('คุณได้ยกเลิกเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
      //     handleClose();
      //     if (onSearchMain) onSearchMain();
      //   } else {
      //     setOpenModalError(true);
      //     setOpenModalCancel(false);
      //   }
      // } catch (error) {
      //   setOpenModalError(true);
      //   setOpenModalCancel(false);
      // }
    } else {
      setOpenPopup(true);
      setPopupMsg('คุณได้ยกเลิกเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
      handleClose();
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseModalCreate}>
          <Typography sx={{ fontSize: '1em' }}>รายละเอียดสร้างแผนตรวจนับสต๊อก</Typography>
          <StepperBar activeStep={status} setActiveStep={setStatus} />
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container mt={1} mb={-1}>
            {/*line 1*/}
            <Grid item container xs={4} mb={5}>
              <Grid item xs={3}>
                สาขา :
              </Grid>
              <Grid item xs={8}>
                {!!values.documentNumber ? values.documentNumber : '-'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                วันที่สร้างรายการ :
              </Grid>
              <Grid item xs={8}>
                {moment(values.createDate).add(543, 'y').format('DD/MM/YYYY')}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5} pl={2}>
              <Grid item xs={3}>
                วันที่กำหนด <br /> ตรวจนับ :
              </Grid>
              <Grid item xs={8}>
                <DatePickerAllComponent
                  onClickDate={onChangeDate.bind(values.countingDate, setValues, values, 'countingDate')}
                  type={'TO'}
                  minDateTo={new Date()}
                  value={values.countingDate}
                  error={!!textErrors.dateError}
                />
              </Grid>
            </Grid>
            {/*line 2*/}
            <Grid item container xs={4} mb={5}>
              <Grid item xs={3}>
                สาขาที่สร้าง <br />
                รายการ :
              </Grid>
              <Grid item xs={8}>
                <BranchListDropDown
                  valueBranch={branchOptions}
                  sourceBranchCode={ownBranch}
                  onChangeBranch={handleChangeBranch}
                  isClear={clearBranchDropDown}
                  disable={groupBranch}
                  isFilterAuthorizedBranch={true}
                  error={textErrors.branchError != ''}
                />
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                เอกสาร SC :
              </Grid>
              <Grid item xs={8}></Grid>
            </Grid>
            <Grid item container xs={4} mb={5} pl={2}>
              <Grid item xs={4}>
                เอกสาร SA :
              </Grid>
              <Grid item xs={8}></Grid>
            </Grid>
            {/*line 3*/}
            <Grid container item xs={4} mb={5} mt={-1}>
              <Grid item xs={3}>
                เอกสาร SL :
              </Grid>
              <Grid item xs={8}></Grid>
            </Grid>
          </Grid>
          <Box>
            <Box sx={{ display: 'flex', marginBottom: '18px' }}>
              <Box>
                <Button
                  id="btnAddItem"
                  variant="contained"
                  color="info"
                  className={classes.MbtnSearch}
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={handleOpenAddItems}
                  sx={{ width: 126 }}
                  disabled={steps.indexOf(status) > 0}
                >
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  id="btnSaveDraft"
                  variant="contained"
                  color="warning"
                  startIcon={<SaveIcon />}
                  disabled={
                    steps.indexOf(status) > 0 ||
                    (payloadAddTypeProduct && payloadAddTypeProduct.length === 0) ||
                    !managePermission
                  }
                  onClick={() => handleCreateDraft()}
                  className={classes.MbtnSearch}
                >
                  บันทึก
                </Button>
                <Button
                  id="btnConfirm"
                  variant="contained"
                  color="primary"
                  sx={{ margin: '0 17px' }}
                  disabled={steps.indexOf(status) < 0 || !managePermission}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleConfirm}
                  className={classes.MbtnSearch}
                >
                  ขออนุมัติ
                </Button>
                <Button
                  id="btnCancel"
                  variant="contained"
                  color="error"
                  disabled={steps.indexOf(status) !== 0 || !managePermission}
                  startIcon={<HighlightOffIcon />}
                  onClick={handleOpenCancel}
                  className={classes.MbtnSearch}
                >
                  ยกเลิก
                </Button>
              </Box>
            </Box>
            <Box>
              <AuditPlanCreateItem status={status} />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ModelConfirm
        open={openModalConfirm}
        onClose={() => handleCloseModalConfirm(false)}
        onConfirm={() => handleCloseModalConfirm(true)}
        barCode={values.documentNumber}
        headerTitle={'ยืนยันสร้างแผนตรวจนับสต๊อก'}
        documentField={'เลขที่เอกสาร'}
      />

      <ModalAddTypeProduct
        open={openModelAddItems}
        onClose={handleCloseModalAddItems}
        title="เพิ่มรายการสินค้า*"
        showSearch={true}
        textBtn="เพิ่มสินค้า"
        requestBody={{
          isControlStock: true,
        }}
        isControlStockType={true}
      />

      <ModalConfirmCouting
        open={openModalConfirmCouting}
        onClose={handleCloseModalConfirmCouting}
        onConfirm={handleCouting}
      />

      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onConfirm={handleDeleteDraft}
        barCode={values.documentNumber}
        headerTitle={'ยืนยันยกเลิกเบิกใช้ในการทำกิจกรรม'}
        documentField={'เลขที่เอกสารเบิก'}
      />
      <SnackbarStatus open={openPopupModal} onClose={handleClosePopup} isSuccess={true} contentMsg={textPopup} />
      <AlertError open={openModalError} onClose={handleCloseModalError} textError={alertTextError} />
      <ConfirmCloseModel open={openModalClose} onClose={() => setOpenModalClose(false)} onConfirm={handleClose} />
    </div>
  );
}
