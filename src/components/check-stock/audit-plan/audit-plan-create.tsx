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
import { getBranchName, onChangeDate, stringNullOrEmpty } from '../../../utils/utils';
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
import { saveDraftAuditPlan } from '../../../services/audit-plan';
import { updateAddTypeAndProductState } from '../../../store/slices/add-type-product-slice';

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
  countingDate: Date | null;
  branch: string;
  documentNumber: string;
}

const _ = require('lodash');

export default function ModalCreateAuditPlan({
  isOpen,
  onClickClose,
  setOpenPopup,
  setPopupMsg,
  onSearchMain,
  userPermission,
}: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(isOpen);
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [openModelAddItems, setOpenModelAddItems] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('');
  const [errors, setErrors] = React.useState<any>([]);
  const [openModalConfirmCouting, setOpenModalConfirmCouting] = React.useState<boolean>(false);

  const [values, setValues] = React.useState<Values>({
    id: '',
    countingDate: null,
    branch: '',
    documentNumber: '',
  });

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

  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  const [checkEdit, updateCheckEdit] = React.useState(false);
  //permission
  const [approvePermission, setApprovePermission] = useState<boolean>(
    userPermission != null && userPermission.length > 0 ? userPermission.includes(ACTIONS.CAMPAIGN_TO_APPROVE) : false
  );

  const payloadAddTypeProduct = useAppSelector((state) => state.addTypeAndProduct.state);
  const [alertTextError, setAlertTextError] = React.useState('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');

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

  const handleCouting = () => {
    console.log('du ma cuoc doi');
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

  useEffect(() => {
    if (payloadAddItem.length == 0 && status == '') {
      updateCheckEdit(false);
    } else {
      updateCheckEdit(true);
    }
  }, [payloadAddItem]);

  useEffect(() => {
    if (values.branch) {
      setTextErrors({ ...textErrors, branchError: '' });
    }
    if (values.countingDate) {
      setTextErrors({ ...textErrors, dateError: '' });
    }
    updateCheckEdit(true);
  }, [values.branch, values.countingDate]);

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

  const handleCreateDraft = async (sendRequest: boolean) => {
    if (validate()) {
      // try {
      //   const products = payloadAddTypeProduct
      //     .filter((el: any) => el.selectedType === 2)
      //     .map((item: any) => {
      //       return {
      //         name: item.barcodeName,
      //         sku: item.skuCode,
      //       };
      //     });
      //   const body = !!values.id
      //     ? {
      //         id: values.id,
      //         branchCode: values.branch,
      //         branchName: getBranchName(branchList, values.branch),
      //         countingDate: moment(values.countingDate).toISOString(true),
      //         product: products,
      //       }
      //     : {
      //         branchCode: values.branch,
      //         branchName: getBranchName(branchList, values.branch),
      //         countingDate: moment(values.countingDate).toISOString(true),
      //         product: products,
      //       };
      //   const rs = await saveDraftAuditPlan(body);
      //   if (rs.code === 20000) {
      //     if (!sendRequest) {
      //       updateCheckEdit(false);
      //       setOpenPopupModal(true);
      //       setTextPopup('คุณได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว');
      //       if (onSearchMain) onSearchMain();
      //       setValues({
      //         ...values,
      //         id: rs.data.id,
      //         documentNumber: rs.data.documentNumber,
      //       });
      //       setStatus(StockActionStatus.DRAFT);
      //     }
      //   } else {
      //     setOpenModalError(true);
      //   }
      // } catch (error) {
      //   setOpenModalError(true);
      // }
    }
  };

  const handleConfirm = () => {
    setOpenModalConfirmCouting(true);
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
                {moment(new Date()).add(543, 'y').format('DD/MM/YYYY')}
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
                  style={{
                    display:
                      (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) || approvePermission
                        ? 'none'
                        : undefined,
                  }}
                  disabled={!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT}
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
                    (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) ||
                    (payloadAddTypeProduct && payloadAddTypeProduct.length === 0)
                  }
                  style={{
                    display:
                      (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) || approvePermission
                        ? 'none'
                        : undefined,
                  }}
                  onClick={() => handleCreateDraft(false)}
                  className={classes.MbtnSearch}
                >
                  บันทึก
                </Button>
                <Button
                  id="btnConfirm"
                  variant="contained"
                  color="primary"
                  sx={{ margin: '0 17px' }}
                  disabled={
                    (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) ||
                    (payloadAddTypeProduct && payloadAddTypeProduct.length === 0)
                  }
                  style={{
                    display:
                      (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) || approvePermission
                        ? 'none'
                        : undefined,
                  }}
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
                  disabled={
                    stringNullOrEmpty(status) || (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT)
                  }
                  style={{
                    display:
                      (!stringNullOrEmpty(status) && status != StockActionStatus.DRAFT) || approvePermission
                        ? 'none'
                        : undefined,
                  }}
                  startIcon={<HighlightOffIcon />}
                  onClick={handleOpenCancel}
                  className={classes.MbtnSearch}
                >
                  ยกเลิก
                </Button>
              </Box>
            </Box>
            <Box>
              <AuditPlanCreateItem disabled={false} />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

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
