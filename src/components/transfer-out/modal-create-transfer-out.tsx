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
  updateCheckStock,
  updateCheckEdit, updateApproveReject,
} from '../../store/slices/transfer-out-slice';
import {
  sendForApprovalBarcodeDiscount,
  cancelBarcodeDiscount,
  saveDraftBarcodeDiscount,
  checkStockBalance, approveBarcodeDiscount, uploadAttachFile,
} from '../../services/barcode-discount';
import AlertError from '../commons/ui/alert-error';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { getBranchName, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action, TOStatus } from '../../utils/enum/common-enum';
import ConfirmCloseModel from '../commons/ui/confirm-exit-model';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { ACTIONS } from "../../utils/enum/permission-enum";
import { uploadFileState } from "../../store/slices/upload-file-slice";
import AccordionUploadFile from "../commons/ui/accordion-upload-file";
import { getUserInfo } from "../../store/sessionStore";
import ModalTransferOutItem from "./modal-transfer-out-item";
import ModelConfirm from "../barcode-discount/modal-confirm";
import ModalReject from "../barcode-discount/modal-reject";
import ModalCheckStock from "../barcode-discount/modal-check-stock";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface Props {
  action: Action | Action.INSERT;
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  onClickClose: () => void;
  setPopupMsg?: any;
  onSearchBD?: () => void;
  userPermission?: any[];
}

const _ = require('lodash');

export default function ModalCreateTransferOut({
                                                 isOpen,
                                                 onClickClose,
                                                 setOpenPopup,
                                                 action,
                                                 setPopupMsg,
                                                 onSearchBD,
                                                 userPermission,
                                               }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);

  const [valueRadios, setValueRadios] = React.useState<string>('percent');
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const [openModalConfirmApprove, setOpenModalConfirmApprove] = React.useState<boolean>(false);
  const [openModalReject, setOpenModalReject] = React.useState<boolean>(false);
  const classes = useStyles();

  const [openModelAddItems, setOpenModelAddItems] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalCheck, setOpenModalCheck] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openCheckStock, setOpenCheckStock] = React.useState<boolean>(false);
  const [openModalClose, setOpenModalClose] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>('');
  const [listProducts, setListProducts] = React.useState<object[]>([]);
  const dispatch = useAppDispatch();
  let dataAfterValidate: any = [];
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadTransferOut = useAppSelector((state) => state.transferOutSlice.createDraft);
  const dataDetail = useAppSelector((state) => state.transferOutSlice.dataDetail);
  const approveReject = useAppSelector((state) => state.transferOutSlice.approveReject);
  const checkEdit = useAppSelector((state) => state.transferOutSlice.checkEdit);
  const errorList = useAppSelector((state) => state.transferOutSlice.errorList);

  //get detail from search
  const barcodeDiscountDetail = useAppSelector((state) => state.barcodeDiscountDetailSlice.barcodeDiscountDetail.data);
  //permission
  const [approvePermission, setApprovePermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
    ? userPermission.includes(ACTIONS.CAMPAIGN_BD_APPROVE) : false);
  const [uploadFileFlag, setUploadFileFlag] = React.useState(false);
  const [attachFileOlds, setAttachFileOlds] = React.useState<any>([]);
  const [attachFileError, setAttachFileError] = React.useState('');
  const fileUploadList = useAppSelector((state) => state.uploadFileSlice.state);
  const [alertTextError, setAlertTextError] = React.useState('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [currentBranch, setCurrentBranch] = React.useState((branchList && branchList.length > 0 && getUserInfo().branch)
    ? (getUserInfo().branch + ' - ' + getBranchName(branchList, getUserInfo().branch)) : '');

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

  const handleOpenModalConfirmApprove = (autoApproved: boolean) => {
    if (autoApproved) {
      //validate attach file
      if (fileUploadList.length === 0 && attachFileOlds.length === 0) {
        setAttachFileError('กรุณาแนบไฟล์เอกสาร');
        return;
      }
    } else {
      setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
      if (!validate(true)) {
        dispatch(updateErrorList(dataAfterValidate));
        setOpenModalError(true);
        return;
      }
    }
    setOpenModalConfirmApprove(true);
  };

  const handleCloseModalConfirmApprove = (confirm: boolean) => {
    setOpenModalConfirmApprove(false);
    if (confirm) {
      if (!payloadTransferOut.percentDiscount && TOStatus.DRAFT == status) {
        handleSendForApproval(dataDetail.id);
      } else {
        handleApprove();
      }
    }
  };

  const handleOpenModalReject = () => {
    setOpenModalReject(true);
  };

  const handleCloseModalReject = (confirm: boolean) => {
    setOpenModalReject(false);
    if (confirm) {
      setOpenPopup(true);
      setPopupMsg('คุณได้ทำการไม่อนุมัติส่วนลดสินค้าเรียบร้อยแล้ว');
      handleClose();
      if (onSearchBD) onSearchBD();
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
    if (dataDetail.status === '' && Object.keys(payloadAddItem).length) {
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
    if (Action.UPDATE === action && !objectNullOrEmpty(barcodeDiscountDetail)) {
      //set value for data detail
      setValueRadios(barcodeDiscountDetail.percentDiscount ? 'percent' : 'amount');
      dispatch(
        updateDataDetail({
          id: barcodeDiscountDetail.id,
          documentNumber: barcodeDiscountDetail.documentNumber,
          status: barcodeDiscountDetail.status,
          createdDate: barcodeDiscountDetail.createdDate,
          approvedDate: barcodeDiscountDetail.approvedDate,
          percentDiscount: barcodeDiscountDetail.percentDiscount,
        })
      );
      //set value for approve/reject
      dispatch(
        updateApproveReject({
          ...approveReject,
          approvalNote: barcodeDiscountDetail.rejectReason
        })
      );
      //set value for attach files
      if (barcodeDiscountDetail.attachFiles && barcodeDiscountDetail.attachFiles.length > 0) {
        let lstAttachFile: any = [];
        for (let item of barcodeDiscountDetail.attachFiles) {
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
      if (barcodeDiscountDetail.products && barcodeDiscountDetail.products.length > 0) {
        let lstProductDetail: any = [];
        for (let item of barcodeDiscountDetail.products) {
          lstProductDetail.push({
            barcode: item.barcode,
            barcodeName: item.productName,
            unitName: item.unitFactor,
            unitPrice: item.price || 0,
            discount: item.requestedDiscount || 0,
            qty: item.numberOfDiscounted || 0,
            numberOfApproved: (TOStatus.WAIT_FOR_APPROVAL == barcodeDiscountDetail.status && approvePermission)
              ? (item.numberOfDiscounted || 0) : (item.numberOfApproved || 0),
            expiryDate: item.expiredDate,
            skuCode: item.skuCode,
          });
        }
        dispatch(updateAddItemsState(lstProductDetail));
      }
      //set value for requesterNote
      dispatch(
        save({
          ...payloadTransferOut,
          requesterNote: barcodeDiscountDetail.requesterNote,
        })
      );
    }
  }, [barcodeDiscountDetail]);

  const validate = (checkApprove: boolean) => {
    let isValid = true;
    const data = [...payloadTransferOut.products];
    if (data.length > 0) {
      let dt: any = [];
      for (let preData of data) {
        const item = {
          id: preData.barcode,
          errorDiscount: '',
          errorNumberOfDiscounted: '',
          errorNumberOfApproved: '',
          errorExpiryDate: '',
        };

        if (checkApprove) {
          if (stringNullOrEmpty(preData.numberOfApproved)) {
            isValid = false;
            item.errorNumberOfApproved = 'กรุณาระบุจำนวนที่อนุมัติ';
          } else {
            if (preData.numberOfApproved > preData.numberOfDiscounted) {
              isValid = false;
              item.errorNumberOfApproved = 'จำนวนที่อนุมัติต้องไม่เกินจำนวนที่ขอลด';
            }
          }
        } else {
          if (payloadTransferOut.percentDiscount) {
            if (preData.requestedDiscount <= 0 || preData.requestedDiscount >= 100 || !preData.requestedDiscount) {
              isValid = false;
              item.errorDiscount = 'ยอดลดต้องไม่เกิน 100%';
            }
          } else {
            if (
              preData.requestedDiscount <= 0 ||
              !preData.requestedDiscount
            ) {
              isValid = false;
              item.errorDiscount = 'ยอดลดต้องมากกว่า 0';
            } else if (preData.requestedDiscount >= preData.price) {
              isValid = false;
              item.errorDiscount = 'ยอดลดต้องไม่เกินราคาปกติ';
            }
          }
          if (preData.numberOfDiscounted <= 0 || !preData.numberOfDiscounted) {
            isValid = false;
            item.errorNumberOfDiscounted = 'จำนวนที่ขอลดต้องมากกว่า 0';
          }
        }
        if (stringNullOrEmpty(preData.expiredDate)) {
          isValid = false;
          item.errorExpiryDate = 'กรุณาระบุวันหมดอายุ';
        } else {
          if (moment(preData.expiredDate).isBefore(moment(new Date()), 'day')) {
            isValid = false;
            item.errorExpiryDate = 'วันที่หมดอายุต้องมากกว่าหรือเท่ากับวันที่วันนี้';
          }
        }
        if (!isValid) {
          dt.push(item);
        }
      }
      dataAfterValidate = dt;
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

  const handleCreateDraft = async (sendRequest: boolean) => {
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    if (validate(false)) {
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
      const rsCheckStock = await handleCheckStock();
      if (rsCheckStock) {
        await dispatch(save({ ...payloadTransferOut }));
        try {
          const body = !!dataDetail.id
            ? {
              ...payloadTransferOut,
              id: dataDetail.id,
              documentNumber: dataDetail.documentNumber,
              attachFiles: allAttachFile
            }
            : {
              ...payloadTransferOut,
              attachFiles: allAttachFile
            };
          const rs = await saveDraftBarcodeDiscount(body);
          if (rs.code === 201) {
            if (!sendRequest) {
              dispatch(updateCheckEdit(false));
              setOpenPopupModal(true);
              setTextPopup('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
              if (onSearchBD) onSearchBD();
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
                status: TOStatus.DRAFT,
              })
            );
            if (sendRequest) {
              if (!payloadTransferOut.percentDiscount && TOStatus.DRAFT >= status) {
                handleOpenModalConfirmApprove(true);
              } else {
                handleSendForApproval(rs.data.id);
              }
            }
          } else if (rs.code === 50004) {
            setListProducts(rs.data);
            setOpenModalCheck(true);
          } else {
            setOpenModalError(true);
          }
        } catch (error) {
          setOpenModalError(true);
        }
      }
    } else {
      dispatch(updateErrorList(dataAfterValidate));
      setOpenModalError(true);
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
      const rs = await sendForApprovalBarcodeDiscount(id);
      if (rs.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: TOStatus.WAIT_FOR_APPROVAL,
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ส่งอนุมัติส่วนลดสินค้าเรียบร้อยแล้ว');
        handleClose();
        if (onSearchBD) onSearchBD();
      } else if (rs.code === 20001) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: TOStatus.APPROVED,
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้อนุมัติส่วนลดสินค้าเรียบร้อยแล้ว');
        handleClose();
        if (onSearchBD) onSearchBD();
      } else if (rs.code === 50004) {
        setListProducts(rs.data);
        setOpenModalCheck(true);
      } else {
        setOpenModalError(true);
      }
    } catch (error) {
      setOpenModalError(true);
    }
  };

  const handleApprove = async () => {
    setAlertTextError('กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง');
    try {
      const rs = await approveBarcodeDiscount(dataDetail.id, payloadTransferOut.products);
      if (rs.code === 20000) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: TOStatus.APPROVED,
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้อนุมัติส่วนลดสินค้าเรียบร้อยแล้ว');
        handleClose();
        if (onSearchBD) onSearchBD();
      } else if (rs.code === 50003) {
        dispatch(updateCheckStock(rs.data));
        setOpenCheckStock(true);
      } else if (rs.code === 50004) {
        setListProducts(rs.data);
        setOpenModalCheck(true);
      } else {
        setOpenModalError(true);
      }
    } catch (error) {
      setOpenModalError(true);
    }
  };

  const handleDeleteDraft = async () => {
    setAlertTextError('เกิดข้อผิดพลาดระหว่างการดำเนินการ');
    if (status) {
      try {
        const rs = await cancelBarcodeDiscount(dataDetail.id);
        if (rs.status === 200) {
          setOpenPopup(true);
          setPopupMsg('คุณได้ยกเลิกส่วนลดสินค้าเรียบร้อยแล้ว');
          handleClose();
          if (onSearchBD) onSearchBD();
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
      setPopupMsg('คุณได้ยกเลิกส่วนลดสินค้าเรียบร้อยแล้ว');
      handleClose();
    }
  };

  const handleCheckStock = async () => {
    try {
      const products = payloadTransferOut.products.map((item: any) => {
        return {
          barcode: item.barcode,
          numberOfDiscounted: item.numberOfDiscounted,
        };
      });
      const payload = {
        branchCode: '0002',
        products: products,
      };
      const rs = await checkStockBalance(payload);

      if (rs.data && rs.data.length > 0) {
        dispatch(updateCheckStock(rs.data));
        setOpenCheckStock(true);
      } else {
        dispatch(updateCheckStock([]));
      }
      return rs.data ? !rs.data.length : true;
    } catch (error) {
    }
  };

  const handleReject = () => {
    handleOpenModalReject();
  };

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseModalCreate}>
          <Typography sx={{ fontSize: '1em' }}>สร้างเอกสารเบิกใช้ในการทำกิจกรรม</Typography>
          <StepperBar activeStep={status} setActiveStep={setStatus}/>
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container mt={1}>
            {/*line 1*/}
            <Grid item container xs={4} mb={4}>
              <Grid item xs={4}>
                สาขา :
              </Grid>
              <Grid item xs={8}>
                {currentBranch}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={4}>
              <Grid item xs={4}>
                เลขที่เอกสารเบิก :
              </Grid>
              <Grid item xs={8}>
                {!!dataDetail.documentNumber ? dataDetail.documentNumber : '_'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={4} pl={2}>
              <Grid item xs={4}>
                วันที่ทำรายการ :
              </Grid>
              <Grid item xs={8}>
                {moment(dataDetail.createdDate).add(543, 'y').format('DD/MM/YYYY')}
              </Grid>
            </Grid>
            {/*line 2*/}
            <Grid item container xs={4} mb={4}>
              <Grid item xs={4}>
                วันที่อนุมัติ :
              </Grid>
              <Grid item xs={8}>
                {dataDetail.approvedDate ? moment(dataDetail.approvedDate).add(543, 'y').format('DD/MM/YYYY') : '-'}
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={4}>
              <Grid item xs={4}>
                <Typography align='left' sx={{display: 'flex', width: '100%'}}>
                  เหตุผลการเบิก
                  <Typography sx={{color: '#F54949', marginRight: '5px'}}> * </Typography> :
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth className={classes.Mselect}>
                  <Select
                    id="transferOutReason"
                    name="transferOutReason"
                    value={dataDetail.transferOutReason}
                    onChange={(e) => {
                      dispatch(updateDataDetail({ ...dataDetail, transferOutReason: e.target.value }));
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value={'1'}>{'เบิกเพื่อแจกลูกค้า'}</MenuItem>
                    <MenuItem value={'2'}>{'เบิกเพื่อทำกิจกรรม'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item container xs={4} mb={4} pl={2}>
              <Grid item xs={4}>
                <Typography align='left' sx={{display: 'flex', width: '100%'}}>
                  คลัง
                  <Typography sx={{color: '#F54949', marginRight: '5px'}}> * </Typography> :
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <FormControl fullWidth className={classes.Mselect}>
                  <Select
                    id="store"
                    name="store"
                    value={dataDetail.store}
                    onChange={(e) => {
                      dispatch(updateDataDetail({ ...dataDetail, store: e.target.value }));
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value={'1'}>{'คลังหน้าร้าน'}</MenuItem>
                    <MenuItem value={'2'}>{'คลังหลังร้าน'}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/*line 3*/}
            <Grid container item xs={4} mb={4} mt={-1}>
              <Grid item xs={4}>
                แนบรูปสินค้าขอส่วนลด :
              </Grid>
              <Grid item xs={8}>
                <AccordionUploadFile
                  files={attachFileOlds}
                  docNo={dataDetail ? dataDetail.documentNumber : ''}
                  docType='BD'
                  isStatus={uploadFileFlag}
                  onChangeUploadFile={handleOnChangeUploadFile}
                  onDeleteAttachFile={onDeleteAttachFileOld}
                  // enabledControl={TOStatus.DRAFT === status}
                  warningMessage={attachFileError}
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
                  onClick={() => handleOpenModalConfirmApprove(false)}
                  className={classes.MbtnSearch}>
                  อนุมัติ
                </Button>
                <Button
                  id='btnReject'
                  variant='contained'
                  style={{ display: (status == TOStatus.WAIT_FOR_APPROVAL && approvePermission) ? undefined : 'none' }}
                  color='error'
                  startIcon={<HighlightOffIcon/>}
                  onClick={handleReject}
                  className={classes.MbtnSearch}>
                  ไม่อนุมัติ
                </Button>
              </Box>
            </Box>
            <Box>
              <ModalTransferOutItem id='' typeDiscount={valueRadios} action={action}
                                    userPermission={userPermission}/>
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
        headerTitle={'ยืนยันยกเลิกขอส่วนลดสินค้า'}
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
        headerTitle={'ยืนยันอนุมัติส่วนลดสินค้า'}
      />
      <ModalReject
        open={openModalReject}
        onClose={(confirm) => handleCloseModalReject(confirm)}
        barCode={dataDetail.documentNumber}
        id={dataDetail.id}
      />
    </div>
  );
}
