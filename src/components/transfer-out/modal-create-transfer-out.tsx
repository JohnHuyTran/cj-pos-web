import React, { ReactElement, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  FormControl,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import { useStyles } from '../../styles/makeTheme';
import StepperBar from './stepper-bar';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import ModalAddItems from '../commons/ui/modal-add-items';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  save,
  updateDataDetail,
  updateErrorList,
  updateCheckEdit, updateApproveReject,
} from '../../store/slices/transfer-out-slice';
import {
  uploadAttachFile,
} from '../../services/barcode-discount';
import AlertError from '../commons/ui/alert-error';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { getBranchName, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action, BDStatus, TO_TYPE, TOStatus } from '../../utils/enum/common-enum';
import ConfirmCloseModel from '../commons/ui/confirm-exit-model';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { ACTIONS } from "../../utils/enum/permission-enum";
import { uploadFileState } from "../../store/slices/upload-file-slice";
import AccordionUploadFile from "../commons/ui/accordion-upload-file";
import { getUserInfo } from "../../store/sessionStore";
import ModalTransferOutItem from "./modal-transfer-out-item";
import ModelConfirm from "../barcode-discount/modal-confirm";
import ModalCheckStock from "../barcode-discount/modal-check-stock";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  approveTransferOut,
  cancelTransferOut, endTransferOut, rejectTransferOut,
  saveDraftTransferOut,
  sendForApprovalTransferOut
} from "../../services/transfer-out";
import { updateCheckStock } from "../../store/slices/stock-balance-check-slice";
import { checkStockBalance } from "../../services/common";

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

export default function ModalCreateTransferOut({
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
  const [openModalConfirmSendForApproval, setOpenModalConfirmSendForApproval] = React.useState<boolean>(false);
  const [openModalReject, setOpenModalReject] = React.useState<boolean>(false);
  const [openModalConfirmEnd, setOpenModalConfirmEnd] = React.useState<boolean>(false);
  const [openModelAddItems, setOpenModelAddItems] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openCheckStock, setOpenCheckStock] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('');
  const [errors, setErrors] = React.useState<any>([]);

  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadTransferOut = useAppSelector((state) => state.transferOutSlice.createDraft);
  const dataDetail = useAppSelector((state) => state.transferOutSlice.dataDetail);
  const approveReject = useAppSelector((state) => state.transferOutSlice.approveReject);
  const checkEdit = useAppSelector((state) => state.transferOutSlice.checkEdit);
  const checkStocks = useAppSelector((state) => state.transferOutSlice.checkStock);
  //get detail from search
  const transferOutDetail = useAppSelector((state) => state.transferOutDetailSlice.transferOutDetail.data);
  //permission
  const [approvePermission, setApprovePermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
    ? userPermission.includes(ACTIONS.CAMPAIGN_TO_APPROVE) : false);
  const [uploadFileFlag, setUploadFileFlag] = React.useState(false);
  const [attachFileOlds, setAttachFileOlds] = React.useState<any>([]);
  const [attachFileError, setAttachFileError] = React.useState('');
  const fileUploadList = useAppSelector((state) => state.uploadFileSlice.state);
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

  const handleCloseModalConfirmSendForApproval = (confirm: boolean) => {
    setOpenModalConfirmSendForApproval(false);
    if (confirm) {
      handleSendForApproval(dataDetail.id);
    }
  };

  const handleCloseModalConfirmApprove = (confirm: boolean) => {
    setOpenModalConfirmApprove(false);
    if (confirm) {
      handleApprove();
    }
  };

  const handleOpenModalReject = () => {
    setOpenModalReject(true);
  };

  const handleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleCloseModalError = () => {
    setOpenModalError(false);
  };

  const handleClose = async () => {
    dispatch(updateErrorList([]));
    dispatch(updateAddItemsState({}));
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
      if (transferOutDetail.attachFiles && transferOutDetail.attachFiles.length > 0) {
        let lstAttachFile: any = [];
        for (let item of transferOutDetail.attachFiles) {
          lstAttachFile.push({
            file: null,
            fileKey: item.key,
            fileName: item.name,
            status: 'old',
            mimeType: item.mimeType,
          });
        }
        setAttachFileOlds(lstAttachFile);
        setUploadFileFlag(true);
      }
      //set value for products
      if (transferOutDetail.products && transferOutDetail.products.length > 0) {
        let lstProductDetail: any = [];
        for (let item of transferOutDetail.products) {
          lstProductDetail.push({
            barcode: item.barcode,
            barcodeName: item.productName,
            unitName: item.unitName,
            unitPrice: item.price || 0,
            discount: item.requestedDiscount || 0,
            qty: item.numberOfRequested || 0,
            numberOfApproved: (TOStatus.WAIT_FOR_APPROVAL == transferOutDetail.status && approvePermission)
              ? (item.numberOfRequested || 0) : (item.numberOfApproved || 0),
            expiryDate: item.expiredDate,
            skuCode: item.sku,
            remark: item.remark
          });
        }
        dispatch(updateAddItemsState(lstProductDetail));
      }
    }
  }, [transferOutDetail]);

  const validate = (checkApprove: boolean) => {
    let isValid = true;
    //validate data detail
    if (stringNullOrEmpty(dataDetail.transferOutReason)) {
      isValid = false;
      setErrors({
        ...errors,
        transferOutReason: 'กรุณาระบุรายละเอียด'
      });
    }
    if (stringNullOrEmpty(dataDetail.store)) {
      isValid = false;
      setErrors({
        ...errors,
        store: 'กรุณาระบุรายละเอียด'
      });
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
            item.errorNumberOfApproved = 'กรุณาระบุจำนวนที่อนุมัติ';
          } else {
            if (preData.numberOfApproved > preData.numberOfRequested) {
              isValid = false;
              item.errorNumberOfApproved = 'จำนวนการอนุมัติต้องไม่เกินจำนวนคำขอ';
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

  const handleOnChangeUploadFile = (status: boolean) => {
    setUploadFileFlag(status);
    setAttachFileError('');
  };

  const onDeleteAttachFileOld = (item: any) => {
    let attachFileData = _.cloneDeep(attachFileOlds);
    let attachFileDataFilter = attachFileData.filter((it: any) => it.fileKey !== item.fileKey);
    setAttachFileOlds(attachFileDataFilter);
  };

  const handleUploadAttachFile = async () => {
    try {
      const formData = new FormData();
      for (const it of fileUploadList) {
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

  const handleAllAttachFile = async () => {
    let allAttachFile = [];
    if (fileUploadList && fileUploadList.length > 0) {
      const rsUploadAttachFile = await handleUploadAttachFile();
      if (rsUploadAttachFile.data && rsUploadAttachFile.data.length > 0) {
        allAttachFile.push(...rsUploadAttachFile.data);
      } else {
        setAlertTextError(rsUploadAttachFile.message ? rsUploadAttachFile.message : 'อัปโหลดไฟล์แนบไม่สำเร็จ');
        setOpenModalError(true);
        return;
      }
    }
    if (attachFileOlds && attachFileOlds.length > 0) {
      for (const oldFile of attachFileOlds) {
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
    if (validate(false)) {
      const rsCheckStock = await handleCheckStock();
      if (rsCheckStock) {
        await dispatch(save({ ...payloadTransferOut }));
        try {
          const allAttachFile = await handleAllAttachFile();
          const body = !!dataDetail.id
            ? {
              ...payloadTransferOut,
              id: dataDetail.id,
              documentNumber: dataDetail.documentNumber,
              attachFiles: allAttachFile,
              transferOutReason: dataDetail.transferOutReason,
              store: dataDetail.store,
              type: TO_TYPE.TO_ACTIVITY
            }
            : {
              ...payloadTransferOut,
              attachFiles: allAttachFile,
              transferOutReason: dataDetail.transferOutReason,
              store: dataDetail.store,
              type: TO_TYPE.TO_ACTIVITY
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
              if (rs.data.attachFiles && rs.data.attachFiles.length > 0) {
                let lstAttachFile: any = [];
                for (let item of rs.data.attachFiles) {
                  lstAttachFile.push({
                    file: null,
                    fileKey: item.key,
                    fileName: item.name,
                    status: 'old',
                    mimeType: item.mimeType,
                  });
                }
                await setUploadFileFlag(true);
                await setAttachFileOlds(lstAttachFile);
                await dispatch(uploadFileState([]));
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
              //validate attach file
              if (fileUploadList.length === 0 && attachFileOlds.length === 0) {
                setAttachFileError('กรุณาแนบไฟล์เอกสาร');
                return;
              }
              setOpenModalConfirmSendForApproval(true);
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

  const handleSendRequest = () => {
    handleCreateDraft(true);
  };

  const handleSendForApproval = async (id: string) => {
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    //validate attach file
    if (fileUploadList.length === 0 && attachFileOlds.length === 0) {
      setAttachFileError('กรุณาแนบไฟล์เอกสาร');
      return;
    }
    try {
      const rs = await sendForApprovalTransferOut(id);
      if (rs.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: TOStatus.WAIT_FOR_APPROVAL,
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ส่งขออนุมัติเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
        handleClose();
        if (onSearchMain) onSearchMain();
      } else {
        setOpenModalError(true);
      }
    } catch (error) {
      setOpenModalError(true);
    }
  };

  const handleOpenModalConfirmApprove = () => {
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    if (validate(true)) {
      setOpenModalConfirmApprove(true);
    } else {
      dispatch(updateErrorList(errorListProduct));
      setOpenModalError(true);
    }
  };

  const handleApprove = async () => {
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    try {
      const allAttachFile = await handleAllAttachFile();
      const payload = {
        products: payloadTransferOut.products,
        attachFiles: allAttachFile
      };
      const rs = await approveTransferOut(dataDetail.id, payload);
      if (rs.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: TOStatus.APPROVED,
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ทำการอนุมัติเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
        handleClose();
        if (onSearchMain) onSearchMain();
      } else if (rs.code === 50003) {
        dispatch(updateCheckStock(rs.data));
        setOpenCheckStock(true);
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
          setPopupMsg('คุณได้ยกเลิกเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
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
      setPopupMsg('คุณได้ยกเลิกเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
      handleClose();
    }
  };

  const handleCheckStock = async () => {
    try {
      const products = payloadTransferOut.products.map((item: any) => {
        return {
          barcode: item.barcode,
          numberOfDiscounted: item.numberOfRequested,
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

  const handleCloseModalConfirmReject = async (confirm: boolean) => {
    setOpenModalReject(false);
    if (confirm) {
      handleReject();
    }
  };

  const handleReject = async () => {
    try {
      let res = await rejectTransferOut(dataDetail.id);
      if (res && res.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: Number(TOStatus.REJECTED),
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ทำการไม่อนุมัติเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
        handleClose();
        if (onSearchMain) onSearchMain();
      } else {
        setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
        setOpenModalError(true);
      }
    } catch (error) {
      setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
      setOpenModalError(true);
    }
  };

  const handleOpenModalConfirmEnd = () => {
    setOpenModalConfirmEnd(true);
  };

  const handleCloseModalConfirmEnd = async (confirm: boolean) => {
    setOpenModalConfirmEnd(false);
    if (confirm) {
      handleEnd();
    }
  };

  const handleEnd = async () => {
    try {
      const allAttachFile = await handleAllAttachFile();
      let res = await endTransferOut(dataDetail.id, allAttachFile);
      if (res && res.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: Number(TOStatus.CLOSED),
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ทำการปิดงานเบิกใช้ในการทำกิจกรรมเรียบร้อยแล้ว');
        handleClose();
        if (onSearchMain) onSearchMain();
      } else {
        setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
        setOpenModalError(true);
      }
    } catch (error) {
      setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
      setOpenModalError(true);
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseModalCreate}>
          <Typography sx={{ fontSize: '1em' }}>สร้างเอกสารเบิกใช้ในการทำกิจกรรม</Typography>
          <StepperBar activeStep={status} setActiveStep={setStatus}/>
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container mt={1} mb={-1}>
            {/*line 1*/}
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                สาขา :
              </Grid>
              <Grid item xs={8}>
                {currentBranch}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                เลขที่เอกสารเบิก :
              </Grid>
              <Grid item xs={8}>
                {!!dataDetail.documentNumber ? dataDetail.documentNumber : '_'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5} pl={2}>
              <Grid item xs={4}>
                วันที่ทำรายการ :
              </Grid>
              <Grid item xs={8}>
                {moment(dataDetail.createdDate).add(543, 'y').format('DD/MM/YYYY')}
              </Grid>
            </Grid>
            {/*line 2*/}
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                วันที่อนุมัติ :
              </Grid>
              <Grid item xs={8}>
                {dataDetail.approvedDate ? moment(dataDetail.approvedDate).add(543, 'y').format('DD/MM/YYYY') : '-'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5}>
              <Grid item xs={4}>
                เหตุผลการเบิก :
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth className={classes.Mselect}>
                  <Select
                    id="transferOutReason"
                    name="transferOutReason"
                    value={dataDetail.transferOutReason}
                    onChange={(e) => {
                      dispatch(updateDataDetail({ ...dataDetail, transferOutReason: e.target.value }));
                      setErrors({
                        ...errors,
                        transferOutReason: ''
                      });
                      dispatch(updateCheckEdit(true));
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                    disabled={!stringNullOrEmpty(status) && status != TOStatus.DRAFT && status != TOStatus.WAIT_FOR_APPROVAL}
                    error={!stringNullOrEmpty(errors['transferOutReason'])}
                  >
                    <MenuItem value={'1'}>{'เบิกเพื่อแจกลูกค้า'}</MenuItem>
                    <MenuItem value={'2'}>{'เบิกเพื่อทำกิจกรรม'}</MenuItem>
                  </Select>
                  <Typography hidden={stringNullOrEmpty(errors['transferOutReason'])}
                              display={'flex'} justifyContent={'flex-end'}
                              sx={{ color: '#F54949' }}>
                    {errors['transferOutReason']}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={5} pl={2}>
              <Grid item xs={4}>
                คลัง :
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth className={classes.Mselect}>
                  <Select
                    id="store"
                    name="store"
                    value={dataDetail.store}
                    onChange={(e) => {
                      dispatch(updateDataDetail({ ...dataDetail, store: e.target.value }));
                      setErrors({
                        ...errors,
                        store: ''
                      });
                      dispatch(updateCheckEdit(true));
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                    disabled={!stringNullOrEmpty(status) && status != TOStatus.DRAFT && status != TOStatus.WAIT_FOR_APPROVAL}
                    error={!stringNullOrEmpty(errors['store'])}
                  >
                    <MenuItem value={'1'}>{'คลังหน้าร้าน'}</MenuItem>
                    <MenuItem value={'2'}>{'คลังหลังร้าน'}</MenuItem>
                  </Select>
                  <Typography hidden={stringNullOrEmpty(errors['store'])}
                              display={'flex'} justifyContent={'flex-end'}
                              sx={{ color: '#F54949' }}>
                    {errors['store']}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            {/*line 3*/}
            <Grid container item xs={4} mb={5} mt={-1}>
              <Grid item xs={4}>
                แนบรูปสินค้าขอส่วนลด :
              </Grid>
              <Grid item xs={8}>
                <AccordionUploadFile
                  files={attachFileOlds}
                  docNo={dataDetail ? dataDetail.documentNumber : ''}
                  docType='TO'
                  isStatus={uploadFileFlag}
                  onChangeUploadFile={handleOnChangeUploadFile}
                  onDeleteAttachFile={onDeleteAttachFileOld}
                  enabledControl={TOStatus.DRAFT === status
                    || TOStatus.WAIT_FOR_APPROVAL === status
                    || TOStatus.APPROVED === status}
                  warningMessage={attachFileError}
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
                  disabled={(!stringNullOrEmpty(status) && status != TOStatus.DRAFT)}>
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  id='btnSaveDraft'
                  variant='contained'
                  color='warning'
                  startIcon={<SaveIcon/>}
                  disabled={(!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || (payloadTransferOut.products && payloadTransferOut.products.length === 0)}
                  style={{ display: ((!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || approvePermission) ? 'none' : undefined }}
                  onClick={() => handleCreateDraft(false)}
                  className={classes.MbtnSearch}>
                  บันทึก
                </Button>
                <Button
                  id='btnSendForApproval'
                  variant='contained'
                  color='primary'
                  sx={{ margin: '0 17px' }}
                  disabled={(!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || (payloadTransferOut.products && payloadTransferOut.products.length === 0)}
                  style={{ display: ((!stringNullOrEmpty(status) && status != TOStatus.DRAFT) || approvePermission) ? 'none' : undefined }}
                  startIcon={<CheckCircleOutlineIcon/>}
                  onClick={handleSendRequest}
                  className={classes.MbtnSearch}>
                  ขออนุมัติ
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
                <Button
                  id='btnApprove'
                  sx={{ margin: '0 17px' }}
                  style={{ display: (status == TOStatus.WAIT_FOR_APPROVAL && approvePermission) ? undefined : 'none' }}
                  variant='contained'
                  color='primary'
                  startIcon={<CheckCircleOutlineIcon/>}
                  onClick={handleOpenModalConfirmApprove}
                  className={classes.MbtnSearch}>
                  อนุมัติ
                </Button>
                <Button
                  id='btnReject'
                  variant='contained'
                  style={{ display: (status == TOStatus.WAIT_FOR_APPROVAL && approvePermission) ? undefined : 'none' }}
                  color='error'
                  startIcon={<HighlightOffIcon/>}
                  onClick={handleOpenModalReject}
                  className={classes.MbtnSearch}>
                  ไม่อนุมัติ
                </Button>
                <Button
                  id='btnEnd'
                  variant='contained'
                  style={{ display: (status != TOStatus.APPROVED || approvePermission) ? 'none' : undefined}}
                  color='info'
                  startIcon={<CheckCircleOutlineIcon/>}
                  onClick={handleOpenModalConfirmEnd}
                  className={classes.MbtnSearch}>
                  ปิดงาน
                </Button>
              </Box>
            </Box>
            <Box>
              <ModalTransferOutItem id='' action={action} userPermission={userPermission}/>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ModalAddItems
        open={openModelAddItems}
        onClose={handleModelAddItems}
        requestBody={{
          skuCodes: [],
        }}/>
      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onConfirm={handleDeleteDraft}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันส่งขอเบิกใช้ในการทำกิจกรรม'}
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
      />
      <ConfirmCloseModel open={openModalClose} onClose={() => setOpenModalClose(false)} onConfirm={handleClose}/>
      <ModelConfirm
        open={openModalConfirmApprove}
        onClose={() => handleCloseModalConfirmApprove(false)}
        onConfirm={() => handleCloseModalConfirmApprove(true)}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันอนุมัติเบิกใช้ในการทำกิจกรรม'}
        documentField={'เลขที่เอกสารเบิก'}
      />
      <ModelConfirm
        open={openModalReject}
        onClose={() => handleCloseModalConfirmReject(false)}
        onConfirm={() => handleCloseModalConfirmReject(true)}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันไม่อนุมัติเบิกใช้ในการทำกิจกรรม'}
        documentField={'เลขที่เอกสารเบิก'}
      />
      <ModelConfirm
        open={openModalConfirmSendForApproval}
        onClose={() => handleCloseModalConfirmSendForApproval(false)}
        onConfirm={() => handleCloseModalConfirmSendForApproval(true)}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันส่งขอเบิกใช้ในการทำกิจกรรม'}
        documentField={'เลขที่เอกสารเบิก'}
      />
      <ModelConfirm
        open={openModalConfirmEnd}
        onClose={() => handleCloseModalConfirmEnd(false)}
        onConfirm={() => handleCloseModalConfirmEnd(true)}
        barCode={dataDetail.documentNumber}
        headerTitle={'ยืนยันปิดงานเบิกใช้ในการทำกิจกรรม'}
        documentField={'เลขที่เอกสารเบิก'}
      />
    </div>
  );
}
