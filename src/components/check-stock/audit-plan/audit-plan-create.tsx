import React, { ReactElement, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Button, Dialog, DialogContent, FormControl, Grid, Input, Link, MenuItem, Select, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ImportAppIcon from '@mui/icons-material/ExitToApp';
import SaveIcon from '@mui/icons-material/Save';
import { useStyles } from '../../../styles/makeTheme';
import StepperBar from './stepper-bar';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import AlertError from '../../commons/ui/alert-error';
import { getBranchName, objectNullOrEmpty, onChangeDate, stringNullOrEmpty } from '../../../utils/utils';
import { Action, StockActionStatus, STOCK_COUNTER_TYPE } from '../../../utils/enum/common-enum';
import ConfirmCloseModel from '../../commons/ui/confirm-exit-model';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import { ACTIONS, KEYCLOAK_GROUP_AUDIT } from '../../../utils/enum/permission-enum';
import { getUserInfo } from '../../../store/sessionStore';
import ModelConfirm from '../../barcode-discount/modal-confirm';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import { BranchListOptionType } from '../../../models/branch-model';
import { getUserGroup, isChannelBranch, isGroupAuditParam } from '../../../utils/role-permission';
import ModalAddTypeProduct from '../../commons/ui/modal-add-type-products';
import AuditPlanCreateItem from './audit-plan-create-item';
import ModalConfirmCounting from './modal-confirm-counting';
import {
  cancelAuditPlan,
  confirmAuditPlan,
  countingAuditPlan,
  saveDraftAuditPlan,
  updateAuditPlan,
} from '../../../services/audit-plan';
import { updateAddTypeAndProductState } from '../../../store/slices/add-type-product-slice';
import { PayloadCounting } from '../../../models/audit-plan';
import { clearDataFilter, getAuditPlanDetail } from '../../../store/slices/audit-plan-detail-slice';
import { setCheckEdit } from '../../../store/slices/sale-limit-time-slice';
import DocumentList from './modal-documents-list';
import { env } from '../../../adapters/environmentConfigs';
import { importST } from '../../../services/sale-limit-time';
import ModalValidateImport from '../../sale-limit-time/modal-validate-import';
import ModalCreateStockAdjustment from "../stock-adjustment/modal-create-stock-adjustment";
import { updateDataDetail } from "../../../store/slices/stock-adjustment-slice";
import { getStockAdjustmentDetail } from "../../../store/slices/stock-adjustment-detail-slice";
import { clearCalculate } from "../../../store/slices/stock-adjust-calculate-slice";

interface Props {
  action: Action | Action.INSERT;
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  onClickClose: () => void;
  setPopupMsg?: any;
  onSearchMain?: () => void;
  onReSearchMain?: (branch: string) => void;
  userPermission?: any[];
  viewMode?: boolean;
  isRedirect?: boolean;
}

interface Values {
  id: string;
  countingDate: Date | null | any;
  branch: string;
  documentNumber: string;
  createDate: Date | null | any;
  stockCounter: number;
}

const _ = require('lodash');

const steps = [StockActionStatus.DRAFT, StockActionStatus.CONFIRM, StockActionStatus.COUNTING, StockActionStatus.END];

export default function ModalCreateAuditPlan({
  isOpen,
  onClickClose,
  setOpenPopup,
  setPopupMsg,
  onSearchMain,
  onReSearchMain,
  action,
  viewMode,
}: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(isOpen);
  const [openSA, setOpenSA] = React.useState<boolean>(false);
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = React.useState<boolean>(false);
  const [openModelAddItems, setOpenModelAddItems] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<any>('');
  const [openModalConfirmCounting, setOpenModalConfirmCounting] = React.useState<boolean>(false);
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [ownBranch, setOwnBranch] = React.useState(
    getUserInfo().branch ? (getBranchName(branchList, getUserInfo().branch) ? getUserInfo().branch : '') : ''
  );
  const branchName = getBranchName(branchList, ownBranch);
  const [groupBranch, setGroupBranch] = React.useState(isChannelBranch);
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [branchMap, setBranchMap] = React.useState<BranchListOptionType>({
    code: ownBranch,
    name: branchName ? branchName : '',
  });
  const userName = getUserInfo().preferred_username ? getUserInfo().preferred_username : '';
  const userGroups = getUserInfo().groups ? getUserInfo().groups : [];
  const _group = getUserGroup(userGroups);
  const [currentName, setCurrentName] = React.useState<string>('');
  const [disableCounting, setDisableCounting] = React.useState<boolean>(false);
  const [branchOptions, setBranchOptions] = React.useState<BranchListOptionType | null>(groupBranch ? branchMap : null);
  const checkEdit = useAppSelector((state) => state.saleLimitTime.checkEdit);
  const [values, setValues] = React.useState<Values>({
    id: '',
    countingDate: null,
    branch: groupBranch ? ownBranch : '',
    documentNumber: '',
    createDate: new Date(),
    stockCounter: isGroupAuditParam(_group) ? 0 : STOCK_COUNTER_TYPE.BRANCH,
  });
  const [reSave, setReSave] = React.useState(false);
  const payloadAddItem = useAppSelector((state) => state.addItems.state);

  //permission
  const userInfo = getUserInfo();
  const managePermission =
    userInfo.acl['service.posback-stock'] != null && userInfo.acl['service.posback-stock'].length > 0
      ? userInfo.acl['service.posback-stock'].includes('stock.ap.manage')
      : false;
  const countingPermission =
    userInfo.acl['service.posback-stock'] != null && userInfo.acl['service.posback-stock'].length > 0
      ? userInfo.acl['service.posback-stock'].includes('stock.sc.manage')
      : false;
  const [userPermission, setUserPermission] = useState<any[]>(
    userInfo.acl['service.posback-stock'] != null && userInfo.acl['service.posback-stock'].length > 0
      ? userInfo.acl['service.posback-stock']
      : []
  );
  const manageSAPermission =
    userInfo.acl['service.posback-stock'] != null && userInfo.acl['service.posback-stock'].length > 0
      ? userInfo.acl['service.posback-stock'].includes(ACTIONS.STOCK_SA_MANAGE)
      : false;
  const isBranchPermission = !!(env.branch.channel === 'branch');
  const payloadAddTypeProduct = useAppSelector((state) => state.addTypeAndProduct.state);
  const [alertTextError, setAlertTextError] = React.useState('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
  const dataDetail = useAppSelector((state) => state.auditPlanDetailSlice.auditPlanDetail.data);
  //modal vaildate
  const [openModalValidate, setOpenModalValidate] = React.useState<boolean>(false);
  const [msgModalValidate, setMsgModalValidate] = React.useState<string>('');
  const [urlModalValidate, setUrlModalValidate] = React.useState<string>('');
  
  useEffect(() => {
    if (Action.UPDATE === action && !objectNullOrEmpty(dataDetail)) {
      setStatus(dataDetail.status);
      setCurrentName(dataDetail.createdBy);
      setBranchOptions({
        code: dataDetail.branchCode,
        name: dataDetail.branchName,
      });
      setValues({
        id: dataDetail.id,
        branch: dataDetail.branchCode,
        documentNumber: dataDetail.documentNumber,
        createDate: dataDetail.createdDate,
        countingDate: dataDetail.countingDate ? dataDetail.countingDate : null,
        stockCounter: dataDetail.stockCounter ? dataDetail.stockCounter : 0,
      });
      const products = dataDetail.product
        ? dataDetail.product.map((item: any) => {
            return {
              skuName: item.name,
              skuCode: item.sku,
              selectedType: 2,
            };
          })
        : [];
      dispatch(updateAddTypeAndProductState(products));
      dispatch(setCheckEdit(false));
    }
  }, [dataDetail]);

  useEffect(() => {
    if (moment(values.countingDate).endOf('day').isBefore(moment(new Date()))) {
      setDisableCounting(true);
    } else {
      setDisableCounting(false);
    }
  }, [values.countingDate]);
  useEffect(() => {
    setReSave(true);
  }, [values.countingDate, values.branch]);
  const handleChangeBranch = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branch: JSON.parse(codes) });
    } else {
      setValues({ ...values, branch: '' });
    }
  };

  const handleCloseModalConfirmCounting = () => {
    setOpenModalConfirmCounting(false);
  };

  const handleCounting = async (store: number) => {
    setAlertTextError('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
    try {
      const products = _.uniqBy(
        payloadAddTypeProduct.filter((el: any) => el.selectedType === 2),
        'skuName'
      ).map((item: any) => {
        return {
          name: item.skuName,
          sku: item.skuCode,
          unitName: item.unitName,
          barcode: item.barcode,
        };
      });
      const payload: PayloadCounting = {
        auditPlanning: {
          id: values.id,
          product: products,
          documentNumber: values.documentNumber,
          branchCode: values.branch,
          branchName: getBranchName(branchList, values.branch),
        },
        storeType: store,
      };
      const rs = await countingAuditPlan(payload);
      if (rs.code == 20000) {
        dispatch(setCheckEdit(false));
        // setOpenPopupModal(true);
        // setTextPopup('คุณได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว');

        setStatus(StockActionStatus.COUNTING);
        await dispatch(getAuditPlanDetail(values.id));
      } else {
        setOpenModalError(true);
      }
    } catch (error) {}
  };

  const handleChangeStockCounter = (e: any) => {
    setValues({
      ...values,
      stockCounter: e.target.value,
    });
  };
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };

  const handleCloseModalAddItems = async () => {
    setOpenModelAddItems(false);
  };

  const handleOpenCancel = async () => {
    await dispatch(getAuditPlanDetail(values.id));
    if (dataDetail.relatedScDocuments && dataDetail.relatedScDocuments.length > 0) {
      setOpenModalError(true);
      setAlertTextError('กรุณายกเลิกเอกสารที่เกี่ยวข้องก่อนดำเนินการ');
    } else {
      setOpenModalCancel(true);
    }
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

  const handleCreateDraft = async () => {
    setAlertTextError('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
    try {
      const products = _.uniqBy(
        payloadAddTypeProduct.filter((el: any) => el.selectedType === 2),
        'skuName'
      ).map((item: any) => {
        return {
          name: item.skuName,
          sku: item.skuCode,
          unitName: item.unitName,
          barcode: item.barcode,
        };
      });
      const body = {
        branchCode: values.branch,
        branchName: getBranchName(branchList, values.branch),
        countingDate: moment(values.countingDate).endOf('day').toISOString(true),
        stockCounter: values.stockCounter,
        product: products,
      };
      if (!!values.id) {
        const rs = await updateAuditPlan(values.id, body);
        if (rs.code === 20000) {
          dispatch(setCheckEdit(false));
          setOpenPopupModal(true);
          setTextPopup('คุณได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว');
          setValues({
            ...values,
            id: rs.data.id,
            documentNumber: rs.data.documentNumber,
          });
          setCurrentName(rs.data.createdBy);
          setStatus(StockActionStatus.DRAFT);
        } else {
          setOpenModalError(true);
        }
      } else {
        const rs = await saveDraftAuditPlan(body);
        if (rs.code === 20000) {
          dispatch(setCheckEdit(false));
          setOpenPopupModal(true);
          setTextPopup('คุณได้ทำการบันทึกข้อมูลเรียบร้อยแล้ว');
          setValues({
            ...values,
            id: rs.data.id,
            documentNumber: rs.data.documentNumber,
          });
          setCurrentName(rs.data.createdBy);
          setStatus(StockActionStatus.DRAFT);
        } else {
          setOpenModalError(true);
        }
      }
      setReSave(false);
    } catch (error) {
      setOpenModalError(true);
    }
  };

  const handleConfirm = () => {
    setOpenModalConfirm(true);
  };

  const handleOpenModalCounting = () => {
    setOpenModalConfirmCounting(true);
  };

  const handleCloseModalConfirm = async (confirm: boolean) => {
    setAlertTextError('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
    setOpenModalConfirm(false);
    if (confirm) {
      try {
        if (reSave || checkEdit) {
          await handleCreateDraft();
        }
        const rs = await confirmAuditPlan(values.id);
        if (rs.code == 20000) {
          setStatus(StockActionStatus.CONFIRM);
          dispatch(setCheckEdit(false));
          setOpenPopup(true);
          setPopupMsg('คุณได้ทำการสร้างแผนตรวจนับสต๊อกเรียบร้อยแล้ว');
          if (action == Action.INSERT) {
            if (onReSearchMain) onReSearchMain(values.branch);
          } else {
            if (onSearchMain) onSearchMain();
          }
          handleClose();
        }
      } catch (error) {}
    }
  };

  const handleDeleteDraft = async () => {
    setAlertTextError('กรุณาตรวจสอบ \n กรอกข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
    if (!stringNullOrEmpty(status)) {
      try {
        const rs = await cancelAuditPlan(values.id);
        if (rs.code === 20000) {
          setOpenPopup(true);
          setPopupMsg('คุณได้ยกเลิกสร้างแผนตรวจนับสต๊อกเรียบร้อยแล้ว');
          if (action == Action.INSERT && !!values.branch) {
            if (onReSearchMain) onReSearchMain(values.branch);
          } else {
            if (onSearchMain) onSearchMain();
          }

          handleClose();
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
      setPopupMsg('คุณได้ยกเลิกสร้างแผนตรวจนับสต๊อกเรียบร้อยแล้ว');
      handleClose();
    }
  };

  const handleImportFile = async (e: any) => {
    try {
      if (e.target.files[0]) {
        const formData = new FormData();
        formData.append('barcode', e.target.files[0]);
        const rs = await importST(formData);
        if (!!rs.data) {
          if (rs.code == 20000) {
            let newList = rs.data.appliedProducts.map((item: any) => {
              return {
                selectedType: 2,
                ...item,
              };
            });
            dispatch(updateAddTypeAndProductState(newList));
            setUrlModalValidate('');
            setOpenModalValidate(false);
          }
          if (rs.code == 40002) {
            setUrlModalValidate(rs.data.link);
            setOpenModalValidate(true);
          }
        } else {
          setMsgModalValidate(rs.message);
          setUrlModalValidate('');
          setOpenModalValidate(true);
        }
      }
    } catch (error) {
      throw error;
    }
  };
  const getDisplayCountingBtn = () => {
    let displayCounting = undefined;
    if (
      steps.indexOf(status) < 1 ||
      !countingPermission ||
      viewMode ||
      status == StockActionStatus.CANCEL ||
      !groupBranch
    ) {
      return 'none';
    } else {
      if (
        (groupBranch && values.stockCounter == STOCK_COUNTER_TYPE.BRANCH && !isGroupAuditParam(_group)) ||
        (groupBranch && values.stockCounter == STOCK_COUNTER_TYPE.AUDIT && isGroupAuditParam(_group))
      ) {
        displayCounting = undefined;
      } else {
        displayCounting = 'none';
      } 
    }
    return displayCounting;
  };

  const dataDetailSA = useAppSelector((state) => state.stockAdjustmentSlice.dataDetail);
  const handleOpenSA = async () =>{
    await dispatch(getAuditPlanDetail(dataDetail.id));
    // await dispatch(getStockAdjustmentDetail('62e7a965852639eb91f139d1'));
    const dataDetailSAUpdate = {
      ...dataDetailSA,
      APId: dataDetail.id,
      APDocumentNumber: dataDetail.documentNumber,
      branchCode: dataDetail.branchCode,
      branchName: dataDetail.branchName,
    };
    await dispatch(updateDataDetail(dataDetailSAUpdate));
    await dispatch(clearCalculate());
    setOpenSA(true);
  };

  const handleUpdateAgainDetailAP = () => {
    dispatch(getAuditPlanDetail(dataDetail.id));
  };

  const handleOpenAP = () => {}

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
                เลขที่เอกสาร :
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
                กำหนดตรวจนับภายในวันที่ :
              </Grid>
              <Grid item xs={8}>
                <DatePickerAllComponent
                  onClickDate={onChangeDate.bind(values.countingDate, setValues, values, 'countingDate')}
                  type={'TO'}
                  minDateTo={new Date()}
                  value={values.countingDate}
                  disabled={steps.indexOf(status) > 0}
                  placeHolder={'กรุณาเลือก'}
                  disableMinDateMsg={true}
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
                  disable={groupBranch || viewMode || steps.indexOf(status) > 0}
                  isFilterAuthorizedBranch={true}
                  placeHolder={'กรุณาเลือก'}
                />
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                ผู้นับสต๊อก :
              </Grid>
              <Grid item xs={8}>
                <Box textAlign={'center'}>
                  <FormControl sx={{ width: '100%', textAlign: 'left' }} className={classes.Mselect}>
                    <Select
                      id="status"
                      name="status"
                      value={values.stockCounter}
                      disabled={
                        (action == Action.INSERT && !userGroups.includes(KEYCLOAK_GROUP_AUDIT)) ||
                        steps.indexOf(status) > 0 ||
                        (action == Action.UPDATE &&
                          !userGroups.includes(KEYCLOAK_GROUP_AUDIT) &&
                          currentName == 'posaudit') ||
                        (action == Action.UPDATE &&
                          !userGroups.includes(KEYCLOAK_GROUP_AUDIT) &&
                          currentName != 'posaudit')
                      }
                      onChange={handleChangeStockCounter}
                      inputProps={{ 'aria-label': 'Without label' }}
                      renderValue={
                        values.stockCounter !== 0
                          ? undefined
                          : () => <Typography color={'#AEAEAE'}>กรุณาเลือก</Typography>
                      }>
                      <MenuItem value={STOCK_COUNTER_TYPE.BRANCH}>สาขา </MenuItem>
                      <MenuItem value={STOCK_COUNTER_TYPE.AUDIT}>Audit</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5} pl={2}>
              {steps.indexOf(status) > 1 && dataDetail.relatedScDocuments && (
                <>
                  <Grid item xs={3}>
                    เอกสาร SC :
                  </Grid>
                  <Grid item xs={8}>
                    <DocumentList viewMode={viewMode} handleUpdateAgain={handleUpdateAgainDetailAP} relatedDocuments={dataDetail.relatedScDocuments} type={'SC'}/>
                  </Grid>
                </>
              )}
            </Grid>
            {/*line 3*/}
            <Grid item container xs={4} mb={5} pl={2}>
            {steps.indexOf(status) > 1 && dataDetail.relatedSaDocuments && (
                <>
                  <Grid item xs={3}>
                    เอกสาร SA :
                  </Grid>
                  <Grid item xs={8}>
                  <Link color={'secondary'} component={'button'} variant={'subtitle1'} underline={'always'} onClick={handleOpenAP}>
                  {/* {dataDetail.APDocumentNumber} */}
                </Link>
                  </Grid>
                </>
              )}
            </Grid>
            {/*line 3*/}
            <Grid container item xs={4} mb={5} mt={-1}>
              {/* <Grid item xs={3}>
                เอกสาร SL :
              </Grid> */}
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
                  sx={{ width: 126, mr: '17px'}}
                  disabled={steps.indexOf(status) > 0}
                  style={{
                    display:
                      steps.indexOf(status) > 0 || !managePermission || viewMode || status == StockActionStatus.CANCEL
                        ? 'none'
                        : undefined,
                  }}>
                  เพิ่มสินค้า
                </Button>
                <label htmlFor="import-st-button-file">
                  {Object.keys(payloadAddTypeProduct).length === 0 && (
                    <Input
                      id="import-st-button-file"
                      type="file"
                      onChange={handleImportFile}
                      style={{ display: 'none' }}
                    />
                  )}
                  <Button
                    id="btnImport"
                    variant="contained"
                    color="primary"
                    className={classes.MbtnSearch}
                    startIcon={<ImportAppIcon sx={{ transform: 'rotate(90deg)' }} />}
                    sx={{ width: 126, mr: '17px' }}
                    component="span"
                    style={{
                      display:
                        steps.indexOf(status) > 0 || !managePermission || viewMode || status == StockActionStatus.CANCEL
                          ? 'none'
                          : undefined,
                    }}
                    disabled={!!Object.keys(payloadAddTypeProduct).length}>
                    Import
                  </Button>
                </label>
                <Button
                  id="btnCreateSA"
                  variant="contained"
                  color="info"
                  className={classes.MbtnSearch}
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={handleOpenSA}
                  sx={{ width: 150 , height: '36.5px', mr: '17px'}}
                  disabled={
                    !(dataDetail.relatedScDocuments && dataDetail.relatedScDocuments.length > 0
                    && dataDetail.relatedScDocuments.filter((it:any) => it.status === StockActionStatus.CONFIRM).length > 0)
                  }
                  style={{
                    display: !manageSAPermission || viewMode || status == StockActionStatus.CANCEL
                            || (isGroupAuditParam(_group) && STOCK_COUNTER_TYPE.BRANCH === values.stockCounter)
                            || (dataDetail.relatedSaDocuments && dataDetail.relatedSaDocuments.length > 0)
                        ? 'none'
                        : undefined,
                  }}>
                    <Typography variant={'body2'} fontSize={12} pt={0.3}>
                      สร้างรายการ
                      ปรับสต๊อก (SA)
                    </Typography>
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
                    disableCounting ||
                    values.branch == '' ||
                    values.stockCounter == 0 || 
                    (action == Action.UPDATE && _group != getUserGroup([`/service.posback/${dataDetail.createdByGroup}`]))
                  }
                  style={{
                    display:
                      steps.indexOf(status) > 0 || !managePermission || viewMode || status == StockActionStatus.CANCEL
                        ? 'none'
                        : undefined,
                  }}
                  onClick={() => handleCreateDraft()}
                  className={classes.MbtnSearch}>
                  บันทึก
                </Button>
                <Button
                  id="btnConfirm"
                  variant="contained"
                  color="primary"
                  sx={{ margin: '0 17px' }}
                  disabled={
                    steps.indexOf(status) < 0 ||
                    !managePermission ||
                    (steps.indexOf(status) > 1 && !isBranchPermission) ||
                    values.branch == '' ||
                    values.countingDate == null ||
                    disableCounting
                  }
                  style={{
                    display:
                      steps.indexOf(status) >= 1 ||
                      !managePermission ||
                      viewMode ||
                      status == StockActionStatus.CANCEL || 
                      (action == Action.UPDATE && _group != getUserGroup([`/service.posback/${dataDetail.createdByGroup}`]))
                        ? 'none'
                        : undefined,
                  }}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleConfirm}
                  className={classes.MbtnSearch}>
                  ยืนยัน
                </Button>
                <Button
                  id="btnCounting"
                  variant="contained"
                  color="primary"
                  sx={{ margin: '0 17px' }}
                  disabled={steps.indexOf(status) < 0 || !managePermission || disableCounting}
                  style={{
                    display: getDisplayCountingBtn(),
                  }}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleOpenModalCounting}
                  className={classes.MbtnSearch}>
                  เริ่มตรวจนับ
                </Button>
                <Button
                  id="btnCancel"
                  variant="contained"
                  color="error"
                  disabled={steps.indexOf(status) < 0 || !managePermission}
                  startIcon={<HighlightOffIcon />}
                  onClick={handleOpenCancel}
                  style={{
                    display:
                      !managePermission ||
                      viewMode ||
                      status == StockActionStatus.CANCEL ||
                      (_group != getUserGroup([`/service.posback/${dataDetail.createdByGroup}`]) && steps.indexOf(status) >= 0 && action == Action.UPDATE)
                        ? 'none'
                        : undefined,
                  }}
                  className={classes.MbtnSearch}>
                  ยกเลิก
                </Button>
              </Box>
            </Box>
            <Box>
              <AuditPlanCreateItem status={status} viewMode={viewMode} />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ModalValidateImport isOpen={openModalValidate} title="ไม่สามารถ import file ได้ ">
        <Box sx={{ textAlign: 'center' }}>
          {!!urlModalValidate ? (
            <Typography sx={{ color: '#F54949', marginBottom: '34px' }}>
              <a href={urlModalValidate} target="_blank">
                ดาวน์โหลดผลการ import file คลิ๊กที่ link นี้{' '}
              </a>
            </Typography>
          ) : (
            <Typography sx={{ color: '#F54949', marginBottom: '34px' }}>{msgModalValidate}</Typography>
          )}
          <Button
            id="btnClose"
            variant="contained"
            color="error"
            onClick={() => {
              setOpenModalValidate(false);
            }}>
            ปิด
          </Button>
        </Box>
      </ModalValidateImport>

      {openSA && (
        <ModalCreateStockAdjustment
          isOpen={openSA}
          openFromAP={true}
          onClickClose={async () => {
            setOpenSA(false);
          }}
          action={Action.INSERT}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          userPermission={userPermission}
        />
      )}

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
        title="เพิ่มรายการสินค้า"
        showSearch={false}
        textBtn="เพิ่มสินค้า"
        requestBody={{
          isControlStock: true,
        }}
        isControlStockType={true}
      />

      <ModalConfirmCounting
        open={openModalConfirmCounting}
        onClose={handleCloseModalConfirmCounting}
        onConfirm={handleCounting}
      />

      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onConfirm={handleDeleteDraft}
        barCode={values.documentNumber}
        headerTitle={'ยืนยันยกเลิกสร้างแผนตรวจนับสต๊อก'}
        documentField={'เลขที่เอกสารเบิก'}
      />
      <SnackbarStatus open={openPopupModal} onClose={handleClosePopup} isSuccess={true} contentMsg={textPopup} />
      <AlertError open={openModalError} onClose={handleCloseModalError} textError={alertTextError} />
      <ConfirmCloseModel open={openModalClose} onClose={() => setOpenModalClose(false)} onConfirm={handleClose} />
    </div>
  );
}
