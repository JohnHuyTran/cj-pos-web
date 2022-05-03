import React, { ReactElement, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import { useStyles } from '../../styles/makeTheme';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  save,
  updateDataDetail,
  updateErrorList,
  updateCheckEdit, updateApproveReject,
} from '../../store/slices/transfer-out-destroy-discount-slice';
import {
  uploadAttachFile,
} from '../../services/barcode-discount';
import AlertError from '../commons/ui/alert-error';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { getBranchName, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action, TO_TYPE, TOStatus } from '../../utils/enum/common-enum';
import ConfirmCloseModel from '../commons/ui/confirm-exit-model';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { ACTIONS } from "../../utils/enum/permission-enum";
import { uploadFileState } from "../../store/slices/upload-file-slice";
import AccordionUploadFile from "../commons/ui/accordion-upload-file";
import { getUserInfo } from "../../store/sessionStore";
import ModelConfirm from "../barcode-discount/modal-confirm";
import ModalCheckStock from "../barcode-discount/modal-check-stock";
import {
  cancelTransferOut,
  saveDraftTransferOut,
  sendForApprovalTransferOut
} from "../../services/transfer-out";
import { updateCheckStock } from "../../store/slices/stock-balance-check-slice";
import { checkStockBalance } from "../../services/common";
import AttachFileAfter from "./attach-file-after";
import StepperBarToDestroyDiscount from "./stepper-bar-to-destroy-discount";
import ModalAddProductToDestroyDiscount from "./modal-add-product-to-destroy-discount";
import { uploadFileAfterState } from "../../store/slices/to-destroy-discount-attach-after-slice";
import ModalToDestroyDiscountItem from "./modal-to-destroy-discount-item";
import { updateAddDestroyProductState } from "../../store/slices/add-to-destroy-product-slice";

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

export default function ModalCreateToDestroyDiscount({
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
  const [openModalConfirmApprove, setOpenModalConfirmApprove] = React.useState<boolean>(false);
  const [openModelAddItems, setOpenModelAddItems] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openCheckStock, setOpenCheckStock] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('');
  const [errors, setErrors] = React.useState<any>([]);

  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadTransferOut = useAppSelector((state) => state.transferOutDestroyDiscountSlice.createDraft);
  const dataDetail = useAppSelector((state) => state.transferOutDestroyDiscountSlice.dataDetail);
  const approveReject = useAppSelector((state) => state.transferOutDestroyDiscountSlice.approveReject);
  const checkEdit = useAppSelector((state) => state.transferOutDestroyDiscountSlice.checkEdit);
  //get detail from search
  const transferOutDetail = useAppSelector((state) => state.transferOutDetailSlice.transferOutDetail.data);
  //permission
  const [approvePermission, setApprovePermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
    ? userPermission.includes(ACTIONS.CAMPAIGN_TO_APPROVE) : false);
  const [uploadFileFlag, setUploadFileFlag] = React.useState(false);
  const [uploadFileAfterFlag, setUploadFileAfterFlag] = React.useState(false);
  const [attachFileBeforeOlds, setAttachFileBeforeOlds] = React.useState<any>([]);
  const [attachFileAfterOlds, setAttachFileAfterOlds] = React.useState<any>([]);
  const [attachFileBeforeError, setAttachFileBeforeError] = React.useState('');
  const [attachFileAfterError, setAttachFileAfterError] = React.useState('');
  const fileUploadList = useAppSelector((state) => state.uploadFileSlice.state);
  const fileUploadAfterList = useAppSelector((state) => state.toDestroyDiscountAttachAfterSlice.state);
  const [alertTextError, setAlertTextError] = React.useState('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [currentBranch, setCurrentBranch] = React.useState((branchList && branchList.length > 0 && getUserInfo().branch)
    ? (getUserInfo().branch + ' - ' + getBranchName(branchList, getUserInfo().branch)) : '');
  const [branchCodeCheckStock, setBranchCodeCheckStock] = React.useState(getUserInfo().branch ? getUserInfo().branch : '');

  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };

  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };

  const handleOpenCancel = () => {
    setOpenModalCancel(true);
  };

  const handleCloseModalCancel = () => {
    setOpenModalCancel(false);
  };

  const handleCloseModalConfirmApprove = (confirm: boolean) => {
    setOpenModalConfirmApprove(false);
    if (confirm) {
      handleCreateDraft(true);
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
    dispatch(updateAddDestroyProductState([]));
    dispatch(
      updateDataDetail({
        id: '',
        documentNumber: '',
        status: '',
        approvedDate: null,
        createdDate: moment(new Date()).toISOString(),
        transferOutReason: '',
        store: '2'
      })
    );
    dispatch(updateCheckEdit(false));
    setOpen(false);
    onClickClose();
  };

  const handleCloseModalCreate = () => {
    if ((dataDetail.status === '' && Object.keys(payloadAddItem).length) || checkEdit) {
      setOpenModalClose(true);
    } else if (dataDetail.status === TOStatus.DRAFT && checkEdit) {
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
      //set current branch
      let currentBranch = stringNullOrEmpty(transferOutDetail.branch) ? '' : (transferOutDetail.branch);
      currentBranch += (stringNullOrEmpty(transferOutDetail.branchName) ? '' : (' - ' + transferOutDetail.branchName));
      setCurrentBranch(currentBranch);
      if (!stringNullOrEmpty(transferOutDetail.branch)) {
        setBranchCodeCheckStock(transferOutDetail.branch);
      }
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
      //set value for approve/reject
      dispatch(
        updateApproveReject({
          ...approveReject,
          approvalNote: transferOutDetail.rejectReason
        })
      );
      //set value for attach files
      if (transferOutDetail.beforeAttachFiles && transferOutDetail.beforeAttachFiles.length > 0) {
        let lstAttachFileBefore: any = [];
        for (let item of transferOutDetail.beforeAttachFiles) {
          lstAttachFileBefore.push({
            file: null,
            fileKey: item.key,
            fileName: item.name,
            status: 'old',
            mimeType: item.mimeType,
          });
        }
        setAttachFileBeforeOlds(lstAttachFileBefore);
      }
      if (transferOutDetail.afterAttachFiles && transferOutDetail.afterAttachFiles.length > 0) {
        let lstAttachFileAfter: any = [];
        for (let item of transferOutDetail.afterAttachFiles) {
          lstAttachFileAfter.push({
            file: null,
            fileKey: item.key,
            fileName: item.name,
            status: 'old',
            mimeType: item.mimeType,
          });
        }
        setAttachFileAfterOlds(lstAttachFileAfter);
      }
      //set value for products
      if (transferOutDetail.products && transferOutDetail.products.length > 0) {
        let lstProductDetail: any = [];
        for (let item of transferOutDetail.products) {
          lstProductDetail.push({
            barcode: item.barcode,
            barcodeName: item.productName,
            unit: item.unitName,
            unitPrice: item.price || 0,
            numberOfDiscounted: item.numberOfRequested || 0,
            numberOfApproved: (TOStatus.WAIT_FOR_APPROVAL == transferOutDetail.status && approvePermission)
              ? (item.numberOfRequested || 0) : (item.numberOfApproved || 0),
            skuCode: item.sku,
            remark: item.remark
          });
        }
        dispatch(updateAddDestroyProductState(lstProductDetail));
      }
    }
  }, [transferOutDetail]);

  const validate = (checkApprove: boolean) => {
    let isValid = true;
    //validate data detail
    if (TOStatus.DRAFT == status && fileUploadList.length === 0 && attachFileBeforeOlds.length === 0) {
      setAttachFileBeforeError('AttachFileBefore__กรุณาแนบไฟล์เอกสาร');
      isValid = false;
    }

    //validate product
    const data = [...payloadTransferOut.products];
    if (data.length > 0) {
      let dt: any = [];
      for (let preData of data) {
        const item = {
          id: preData.barcode,
          errorNumberOfRequested: '',
          errorNumberOfApproved: '',
        };

        if (checkApprove) {
          if (stringNullOrEmpty(preData.numberOfApproved)) {
            isValid = false;
            item.errorNumberOfApproved = 'โปรดระบุจำนวนเงินที่ทำลาย';
          } else {
            if (preData.numberOfApproved < 0) {
              isValid = false;
              item.errorNumberOfApproved = 'จำนวนการทำลายต้องมากกว่าหรือเท่ากับ 0';
            } else if (preData.numberOfApproved > preData.numberOfRequested) {
              isValid = false;
              item.errorNumberOfApproved = 'จำนวนที่ทำลายต้องน้อยกว่าหรือเท่ากับจำนวนขอส่วนลด';
            }
          }
        } else {
          if (preData.numberOfRequested <= 0 || !preData.numberOfRequested) {
            isValid = false;
            item.errorNumberOfRequested = 'จำนวนคำขอต้องมากกว่า 0';
          }
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

  const handleOnChangeUploadFileBefore = (status: boolean) => {
    setUploadFileFlag(status);
    setAttachFileBeforeError('');
  };

  const handleOnChangeUploadFileAfter = (status: boolean) => {
    setUploadFileAfterFlag(status);
    setAttachFileAfterError('');
  };

  const onDeleteAttachFileBeforeOld = (item: any) => {
    let attachFileData = _.cloneDeep(attachFileBeforeOlds);
    let attachFileDataFilter = attachFileData.filter((it: any) => it.fileKey !== item.fileKey);
    setAttachFileBeforeOlds(attachFileDataFilter);
  };

  const onDeleteAttachFileAfterOld = (item: any) => {
    let attachFileData = _.cloneDeep(attachFileAfterOlds);
    let attachFileDataFilter = attachFileData.filter((it: any) => it.fileKey !== item.fileKey);
    setAttachFileAfterOlds(attachFileDataFilter);
  };

  const handleUploadAttachFile = async (uploadFileList: any) => {
    try {
      const formData = new FormData();
      for (const it of uploadFileList) {
        formData.append('attachFile', it);
      }
      const rs = await uploadAttachFile(formData);
      if (rs) {
        return rs;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  const handleAllAttachFile = async (uploadFileList: any, attachFileOldList: any) => {
    let allAttachFile = [];
    if (uploadFileList && uploadFileList.length > 0) {
      const rsUploadAttachFile = await handleUploadAttachFile(uploadFileList);
      if (rsUploadAttachFile.data && rsUploadAttachFile.data.length > 0) {
        allAttachFile.push(...rsUploadAttachFile.data);
      } else {
        setAlertTextError(rsUploadAttachFile.message ? rsUploadAttachFile.message : 'อัปโหลดไฟล์แนบไม่สำเร็จ');
        setOpenModalError(true);
        return;
      }
    }
    if (attachFileOldList && attachFileOldList.length > 0) {
      for (const oldFile of attachFileOldList) {
        let attachFileExist = allAttachFile.find((itAll: any) => itAll.name === oldFile.fileName);
        if (objectNullOrEmpty(attachFileExist)) {
          allAttachFile.push({
            key: oldFile.fileKey,
            name: oldFile.fileName,
            mimeType: oldFile.mimeType
          });
        }
      }
    }
    return allAttachFile;
  };

  const handleCreateDraft = async (sendRequest: boolean) => {
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    if (validate(true)) {
      const rsCheckStock = await handleCheckStock();
      if (rsCheckStock) {
        await dispatch(save({ ...payloadTransferOut }));
        try {
          const allAttachFileBefore = await handleAllAttachFile(fileUploadList, attachFileBeforeOlds);
          const allAttachFileAfter = await handleAllAttachFile(fileUploadAfterList, attachFileAfterOlds);
          const body = !!dataDetail.id
            ? {
              ...payloadTransferOut,
              id: dataDetail.id,
              documentNumber: dataDetail.documentNumber,
              beforeAttachFiles: allAttachFileBefore,
              afterAttachFiles: allAttachFileAfter,
              type: TO_TYPE.TO_WITH_DISCOUNT
            }
            : {
              ...payloadTransferOut,
              beforeAttachFiles: allAttachFileBefore,
              afterAttachFiles: allAttachFileAfter,
              type: TO_TYPE.TO_WITH_DISCOUNT
            };
          const rs = await saveDraftTransferOut(body);
          if (rs.code === 201) {
            if (!sendRequest) {
              dispatch(updateCheckEdit(false));
              setOpenPopupModal(true);
              setTextPopup('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
              if (onSearchMain) onSearchMain();
            }
            if (rs && rs.data) {
              if (rs.data.beforeAttachFiles && rs.data.beforeAttachFiles.length > 0) {
                let beforeAttachFiles: any = [];
                for (let item of rs.data.beforeAttachFiles) {
                  beforeAttachFiles.push({
                    file: null,
                    fileKey: item.key,
                    fileName: item.name,
                    status: 'old',
                    mimeType: item.mimeType,
                  });
                }
                await setUploadFileFlag(true);
                await setAttachFileBeforeOlds(beforeAttachFiles);
                await dispatch(uploadFileState([]));
              }
              if (rs.data.afterAttachFiles && rs.data.afterAttachFiles.length > 0) {
                let afterAttachFiles: any = [];
                for (let item of rs.data.afterAttachFiles) {
                  afterAttachFiles.push({
                    file: null,
                    fileKey: item.key,
                    fileName: item.name,
                    status: 'old',
                    mimeType: item.mimeType,
                  });
                }
                await setUploadFileAfterFlag(true);
                await setAttachFileAfterOlds(afterAttachFiles);
                await dispatch(uploadFileAfterState([]));
              }
            }
            dispatch(
              updateDataDetail({
                ...dataDetail,
                id: rs.data.id,
                documentNumber: rs.data.documentNumber,
                status: TOStatus.DRAFT
              })
            );
            if (sendRequest) {
              handleApprove(dataDetail.id);
            }
          } else {
            setOpenModalError(true);
          }
        } catch (error) {
          setOpenModalError(true);
        }
      }
    }
  };

  const handleClickApprove = () => {
    if (TOStatus.DRAFT == status && fileUploadAfterList.length === 0 && attachFileAfterOlds.length === 0) {
      setAttachFileAfterError('AttachFileAfter__กรุณาแนบไฟล์เอกสาร');
      return;
    }
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    if (validate(true)) {
      setOpenModalConfirmApprove(true);
    } else {
      dispatch(updateErrorList(errorListProduct));
      setOpenModalError(true);
    }
  };

  const handleApprove = async (id: string) => {
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    try {
      //handle transfer before and after attach file
      const rs = await sendForApprovalTransferOut(id);
      if (rs.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: TOStatus.APPROVED,
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ทำการอนุมัติเบิกทำลายมีส่วนลดเรียบร้อยแล้ว');
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
          setPopupMsg('คุณได้ยกเลิกเบิกทำลายมีส่วนลดเรียบร้อยแล้ว');
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
      setPopupMsg('คุณได้ยกเลิกเบิกทำลายมีส่วนลดเรียบร้อยแล้ว');
      handleClose();
    }
  };

  const handleCheckStock = async () => {
    try {
      const products = payloadTransferOut.products.map((item: any) => {
        return {
          barcode: item.barcode,
          numberOfDiscounted: item.numberOfApproved,
        };
      });
      const payload = {
        branchCode: branchCodeCheckStock,
        products: products,
      };
      const rs = await checkStockBalance(payload);
      if (rs.data && rs.data.length > 0) {
        await dispatch(updateCheckStock(rs.data));
        setOpenCheckStock(true);
      } else {
        dispatch(updateCheckStock([]));
      }
      return rs.data ? !rs.data.length : true;
    } catch (error) {
      setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
      setOpenModalError(true);
    }
  };

  const genDisabledApproveButton = () => {
    return (!stringNullOrEmpty(status) && status != TOStatus.DRAFT)
      || (payloadTransferOut.products && payloadTransferOut.products.length === 0)
      || (fileUploadList.length === 0 && attachFileBeforeOlds.length === 0)
      || (fileUploadAfterList.length === 0 && attachFileAfterOlds.length === 0)
      || (dataDetail && moment(dataDetail.createdDate).isBefore(moment(new Date), 'day'));
  };

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseModalCreate}>
          <Typography sx={{ fontSize: '1em' }}>สร้างเอกสารทำลาย (ส่วนลด)</Typography>
          <StepperBarToDestroyDiscount activeStep={status} setActiveStep={setStatus}/>
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container mt={1} mb={-1}>
            {/*line 1*/}
            <Grid item container xs={4} mb={5} mr={-3}>
              <Grid item xs={4}>
                สาขา :
              </Grid>
              <Grid item xs={8}>
                {currentBranch}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                เลขที่เอกสารทำลาย :
              </Grid>
              <Grid item xs={8}>
                {!!dataDetail.documentNumber ? dataDetail.documentNumber : '-'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5} pl={3}>
              <Grid item xs={4}>
                วันที่ทำรายการ :
              </Grid>
              <Grid item xs={8}>
                {moment(dataDetail.createdDate).add(543, 'y').format('DD/MM/YYYY')}
              </Grid>
            </Grid>
            {/*line 2*/}
            <Grid item container xs={4} mb={5} mr={-3}>
              <Grid item xs={4}>
                วันที่อนุมัติ :
              </Grid>
              <Grid item xs={8}>
                {dataDetail.approvedDate ? moment(dataDetail.approvedDate).add(543, 'y').format('DD/MM/YYYY') : '-'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={2}>
              <Grid item xs={4}>
                รูปก่อนทำลาย* :
              </Grid>
              <Grid item xs={8}>
                <AccordionUploadFile
                  files={attachFileBeforeOlds}
                  docNo={dataDetail ? dataDetail.documentNumber : ''}
                  docType='TO'
                  isStatus={uploadFileFlag}
                  onChangeUploadFile={handleOnChangeUploadFileBefore}
                  onDeleteAttachFile={onDeleteAttachFileBeforeOld}
                  idControl={'AttachFileBefore'}
                  enabledControl={TOStatus.DRAFT === status}
                  warningMessage={attachFileBeforeError}
                  deletePermission={TOStatus.DRAFT === status}
                />
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={2} pl={3}>
              <Grid item xs={4}>
                รูปหลังทำลาย* :
              </Grid>
              <Grid item xs={8}>
                <AttachFileAfter
                  files={attachFileAfterOlds}
                  docNo={dataDetail ? dataDetail.documentNumber : ''}
                  docType='TO'
                  isStatus={uploadFileAfterFlag}
                  onChangeUploadFile={handleOnChangeUploadFileAfter}
                  onDeleteAttachFile={onDeleteAttachFileAfterOld}
                  idControl={'AttachFileAfter'}
                  enabledControl={(TOStatus.DRAFT === status
                    && (attachFileBeforeOlds && attachFileBeforeOlds.length > 0)
                    || (fileUploadList && fileUploadList.length > 0))}
                  warningMessage={attachFileAfterError}
                  deletePermission={TOStatus.DRAFT === status}
                />
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Box sx={{ display: 'flex', marginBottom: '18px' }}>
              <Box>
                <Button
                  id='btnAddItem'
                  variant='contained'
                  color='info'
                  className={classes.MbtnSearch}
                  startIcon={<AddCircleOutlineOutlinedIcon/>}
                  onClick={handleOpenAddItems}
                  sx={{ width: 126 }}
                  style={{ display: ((!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || approvePermission) ? 'none' : undefined }}
                  disabled={(!stringNullOrEmpty(status) && status != TOStatus.DRAFT)
                    || (dataDetail && moment(dataDetail.createdDate).isBefore(moment(new Date), 'day'))}>
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  id='btnSaveDraft'
                  variant='contained'
                  color='warning'
                  startIcon={<SaveIcon/>}
                  disabled={(!stringNullOrEmpty(status) && status != TOStatus.DRAFT)
                    || (payloadTransferOut.products && payloadTransferOut.products.length === 0)}
                  style={{ display: ((!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || approvePermission) ? 'none' : undefined }}
                  onClick={() => handleCreateDraft(false)}
                  className={classes.MbtnSearch}>
                  บันทึก
                </Button>
                <Button
                  id='btnApprove'
                  variant='contained'
                  color='primary'
                  sx={{ margin: '0 17px' }}
                  disabled={genDisabledApproveButton()}
                  style={{ display: ((!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || approvePermission) ? 'none' : undefined }}
                  startIcon={<CheckCircleOutlineIcon/>}
                  onClick={handleClickApprove}
                  className={classes.MbtnSearch}>
                  อนุมัติ
                </Button>
                <Button
                  id='btnCancel'
                  variant='contained'
                  color='error'
                  disabled={(!stringNullOrEmpty(status) && status != TOStatus.DRAFT)}
                  style={{ display: ((!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || approvePermission) ? 'none' : undefined }}
                  startIcon={<HighlightOffIcon/>}
                  onClick={handleOpenCancel}
                  className={classes.MbtnSearch}>
                  ยกเลิก
                </Button>
              </Box>
            </Box>
            <Box>
              <ModalToDestroyDiscountItem id='' action={action} userPermission={userPermission}/>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ModalAddProductToDestroyDiscount
        open={openModelAddItems}
        onClose={handleModelAddItems}
      />
      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onConfirm={handleDeleteDraft}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันยกเลิกเบิกทำลายมีส่วนลด'}
        documentField={'เลขที่เอกสารเบิก'}
      />
      <SnackbarStatus open={openPopupModal} onClose={handleClosePopup} isSuccess={true} contentMsg={textPopup}/>
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError={alertTextError}
      />
      <ModalCheckStock
        open={openCheckStock}
        onClose={() => {
          setOpenCheckStock(false);
        }}
        headerTitle={'เบิกสินค้ามากกว่าที่มีในคลัง โปรดตรวจสอบ'}
      />
      <ConfirmCloseModel open={openModalClose} onClose={() => setOpenModalClose(false)} onConfirm={handleClose}/>
      <ModelConfirm
        open={openModalConfirmApprove}
        onClose={() => handleCloseModalConfirmApprove(false)}
        onConfirm={() => handleCloseModalConfirmApprove(true)}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันอนุมัติเบิกทำลายมีส่วนลด'}
        documentField={'เลขที่เอกสารเบิก'}
      />
    </div>
  );
}