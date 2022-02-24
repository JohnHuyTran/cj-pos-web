import React, {ReactElement, useEffect, useState} from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
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
import ModalBacodeTransferItem from './modal-barcode-transfer-item';
import moment from 'moment';
import ModelConfirm from './modal-confirm';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  saveBarcodeDiscount,
  updateDataDetail,
  updateErrorList,
  updateCheckStock,
  updateCheckEdit, updateApproveReject,
} from '../../store/slices/barcode-discount-slice';
import {
  sendForApprovalBarcodeDiscount,
  cancelBarcodeDiscount,
  saveDraftBarcodeDiscount,
  checkStockBalance, approveBarcodeDiscount,
} from '../../services/barcode-discount';
import AlertError from '../commons/ui/alert-error';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import {Action, BDStatus} from '../../utils/enum/common-enum';
import ModalCheckStock from './modal-check-stock';
import ModalCheckPrice from './modal-check-price';
import ConfirmCloseModel from '../commons/ui/confirm-exit-model';
import SnackbarStatus from '../commons/ui/snackbar-status';
import {ACTIONS} from "../../utils/enum/permission-enum";
import ModalReject from "./modal-reject";
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

export default function ModalCreateBarcodeDiscount({
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
  const [status, setStatus] = React.useState<number>(0);
  const [listProducts, setListProducts] = React.useState<object[]>([]);
  const dispatch = useAppDispatch();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadBarcodeDiscount = useAppSelector((state) => state.barcodeDiscount.createDraft);
  const dataDetail = useAppSelector((state) => state.barcodeDiscount.dataDetail);
  const approveReject = useAppSelector((state) => state.barcodeDiscount.approveReject);
  const checkStocks = useAppSelector((state) => state.barcodeDiscount.checkStock);
  const checkEdit = useAppSelector((state) => state.barcodeDiscount.checkEdit);

  //get detail from search
  const barcodeDiscountDetail = useAppSelector((state) => state.barcodeDiscountDetailSlice.barcodeDiscountDetail.data);
  //permission
  const [approvePermission, setApprovePermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
      ? userPermission.includes(ACTIONS.CAMPAIGN_BD_APPROVE) : false);

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

  const handleOpenModalConfirmApprove = () => {
    setOpenModalConfirmApprove(true);
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

  const handleCloseModalReject = (confirm: boolean) => {
    setOpenModalReject(false);
    if (confirm) {
      setTextPopup('คุณได้ทำการไม่อนุมัติส่วนลดสินค้าเรียบร้อยแล้ว');
      setOpenPopupModal(true);
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

  const handleCloseModalCheck = () => {
    let updateList = _.cloneDeep(payloadAddItem);
    updateList.map((item: any) => {
      let sameItem: any = listProducts.find((el: any) => item.barcode === el.barcode);
      if (sameItem) {
        item.unitPrice = sameItem.currentPrice;
      }
    });
    dispatch(updateAddItemsState(updateList));
    setOpenModalCheck(false);
  };

  const handleClose = async () => {
    dispatch(updateErrorList([]));
    dispatch(updateAddItemsState({}));
    dispatch(
      updateDataDetail({
        id: '',
        documentNumber: '',
        status: 0,
      })
    );
    dispatch(updateCheckEdit(false));
    dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, requesterNote: '' }));
    setOpen(false);
    onClickClose();
  };

  const handleCloseModalCreate = () => {
    if (dataDetail.status === 0 && Object.keys(payloadAddItem).length) {
      setOpenModalClose(true);
    } else if (dataDetail.status === 1 && checkEdit) {
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
      //set value for products
      if (barcodeDiscountDetail.products != null && barcodeDiscountDetail.products.length > 0) {
        let lstProductDetail: any = [];
        for (let item of barcodeDiscountDetail.products) {
          lstProductDetail.push({
            barcode: item.barcode,
            barcodeName: item.productName,
            unitName: item.unitFactor,
            unitPrice: item.price,
            discount: item.requestedDiscount,
            qty: item.numberOfDiscounted,
            numberOfApproved: item.numberOfApproved,
            expiryDate: item.expiredDate,
            skuCode: item.skuCode,
          });
        }
        dispatch(updateAddItemsState(lstProductDetail));
      }
      //set value for requesterNote
      dispatch(
        saveBarcodeDiscount({
          ...payloadBarcodeDiscount,
          requesterNote: barcodeDiscountDetail.requesterNote,
        })
      );
    }
  }, [barcodeDiscountDetail]);

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueRadios(event.target.value);
    if (event.target.value === 'percent') {
      dispatch(
        saveBarcodeDiscount({
          ...payloadBarcodeDiscount,
          percentDiscount: true,
        })
      );
    } else {
      dispatch(
        saveBarcodeDiscount({
          ...payloadBarcodeDiscount,
          percentDiscount: false,
        })
      );
    }
  };

  let dataAfterValidate: any = [];
  const validate = (checkApprove: boolean) => {
    let isValid = true;
    const data = [...payloadBarcodeDiscount.products];
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
            if (stringNullOrEmpty(preData.numberOfApproved) || preData.numberOfApproved <= 0) {
              isValid = false;
              item.errorNumberOfApproved = 'จำนวนที่อนุมัติต้องมากกว่า 0';
            } else {
              if (preData.numberOfApproved > preData.numberOfDiscounted) {
                isValid = false;
                item.errorNumberOfApproved = 'จำนวนที่อนุมัติต้องไม่เกินจำนวนที่ขอลด';
              }
            }
          } else {
            if (payloadBarcodeDiscount.percentDiscount) {
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
                item.errorDiscount = 'ยลดต้องมากกว่า 0';
              } else if (preData.requestedDiscount >= preData.price) {
                isValid = false;
                item.errorDiscount = 'ยอดลดต้องไม่เกินราคาปกติ';
              }
            }
            if (preData.numberOfDiscounted <= 0 || !preData.numberOfDiscounted) {
              isValid = false;
              item.errorNumberOfDiscounted = 'จำนวนที่ขอลดต้องมากกว่า 0';
            }
            if (!preData.expiredDate) {
              isValid = false;
              item.errorExpiryDate = 'กรุณาระบุวันหมดอายุ';
            }
          }
          if(!isValid) {
            dt.push(item);
          }
       }
       dataAfterValidate = dt;
    }
    return isValid;
  }

  const handleCreateDraft = async (sendRequest: boolean) => {
    if (validate(false)) {
      const rsCheckStock = await handleCheckStock();
      if (rsCheckStock) {
        await dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount}));
        try {
          const body = !!dataDetail.id
              ? { ...payloadBarcodeDiscount, id: dataDetail.id, documentNumber: dataDetail.documentNumber }
              : payloadBarcodeDiscount;
          const rs = await saveDraftBarcodeDiscount(body);
          if (rs.code === 201) {
            if (!sendRequest) {
              dispatch(updateCheckEdit(false));
              setOpenPopupModal(true);
              setTextPopup('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
              if (onSearchBD) onSearchBD();
            }
            dispatch(
                updateDataDetail({
                  ...dataDetail,
                  id: rs.data.id,
                  documentNumber: rs.data.documentNumber,
                  status: 1,
                })
            );
            if (sendRequest) {
              handleSendForApproval(rs.data.id);
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
    try {
      const rs = await sendForApprovalBarcodeDiscount(id);

      if (rs.code === 200) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: Number(BDStatus.WAIT_FOR_APPROVAL),
          })
        );
        setOpenPopup(true);
        setPopupMsg('คุณได้ส่งอนุมัติส่วนลดสินค้าเรียบร้อยแล้ว');
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
    if (validate(true)) {
      try {
        const rs = await approveBarcodeDiscount(dataDetail.id, payloadBarcodeDiscount.products);
        if (rs.code === 20000) {
          dispatch(
              updateDataDetail({
                ...dataDetail,
                status: Number(BDStatus.APPROVED),
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
    } else {
      dispatch(updateErrorList(dataAfterValidate));
      setOpenModalError(true);
    }
  };

  const handleDeleteDraft = async () => {
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
      const products = payloadBarcodeDiscount.products.map((item: any) => {
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
    } catch (error) {}
  };

  const handleReject = () => {
    handleOpenModalReject();
  };

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth={!!true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseModalCreate}>
          <Typography sx={{ fontSize: '1em' }}>ส่วนลดสินค้า</Typography>
          <StepperBar activeStep={status} setActiveStep={setStatus} />
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container sx={{ paddingTop: '50px' }}>
            <Grid item container xs={6} sx={{ marginBottom: '15px' }}>
              <Grid item xs={4}>
                เลขที่เอกสาร BD :
              </Grid>
              <Grid item xs={4}>
                {!!dataDetail.documentNumber ? dataDetail.documentNumber : '_'}
              </Grid>
            </Grid>
            <Grid container item xs={6} sx={{ marginBottom: '15px' }}>
              <Grid item xs={4}>
                วันที่อนุมัติ :
              </Grid>
              <Grid item xs={4}>
                {dataDetail.approvedDate ? moment(dataDetail.approvedDate).add(543, 'y').format('DD/MM/YYYY') : '-'}
              </Grid>
            </Grid>
            <Grid container item xs={6} sx={{ marginBottom: '15px' }}>
              <Grid item xs={4}>
                วันที่ขอส่วนลด :
              </Grid>
              <Grid item xs={4}>
                {moment(dataDetail.createdDate).add(543, 'y').format('DD/MM/YYYY')}
              </Grid>
            </Grid>
            <Grid container item xs={6} sx={{ marginBottom: '15px' }}>
              <Grid item xs={4}>
                สาขา :
              </Grid>
              <Grid item xs={8}>
                0223-สาขาที่00236 สนามจันทร์ (ชุมชนจัทรคามพิทักษ์)
              </Grid>
            </Grid>
            <Grid item container xs={6} sx={{ marginBottom: '15px' }}>
              <Grid item xs={4}>
                ยอดลด :
              </Grid>
              <Grid item xs={8} sx={{ marginTop: '-8px' }}>
                <FormControl component='fieldset' disabled={dataDetail.status > 1}>
                  <RadioGroup
                    aria-label='discount'
                    value={valueRadios}
                    defaultValue={'percent'}
                    name='radio-buttons-group'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string) => {
                      handleChangeRadio(event);
                    }}>
                    <FormControlLabel
                      value='percent'
                      control={<Radio disabled={status > 1} />}
                      label='ยอดลดเป็นเปอร์เซ็น (%)'
                    />
                    <FormControlLabel
                      value='amount'
                      control={<Radio disabled={status > 1} />}
                      label='ยอดลดเป็นจำนวนเงิน (บาท)'
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Box sx={{ display: 'flex', marginBottom: '18px'}}>
              <Box>
                <Button
                  id='btnAddItem'
                  variant='contained'
                  color='info'
                  className={classes.MbtnSearch}
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={handleOpenAddItems}
                  sx={{ width: 126 }}
                  style={{display: (status > 1 && approvePermission) ? 'none' : undefined}}
                  disabled={status > 1}>
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  variant='contained'
                  color='warning'
                  startIcon={<SaveIcon />}
                  disabled={status > 1 || !payloadBarcodeDiscount.products.length}
                  style={{display: (status > 1 && approvePermission) ? 'none' : undefined}}
                  onClick={() => handleCreateDraft(false)}
                  className={classes.MbtnSearch}>
                  บันทึก
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  sx={{ margin: '0 17px' }}
                  disabled={status > 1 || !payloadBarcodeDiscount.products.length}
                  style={{display: (status > 1 && approvePermission) ? 'none' : undefined}}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleSendRequest}
                  className={classes.MbtnSearch}>
                  ขออนุมัติ
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  disabled={status > 1}
                  style={{display: (status > 1 && approvePermission) ? 'none' : undefined}}
                  startIcon={<HighlightOffIcon />}
                  onClick={handleOpenCancel}
                  className={classes.MbtnSearch}>
                  ยกเลิก
                </Button>
                <Button
                    sx={{ margin: '0 17px' }}
                    style={{display: (status > Number(BDStatus.DRAFT) && status < Number(BDStatus.APPROVED) && approvePermission) ? undefined : 'none'}}
                    variant='contained'
                    color='primary'
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={handleOpenModalConfirmApprove}
                    className={classes.MbtnSearch}>
                  อนุมัติ
                </Button>
                <Button
                    variant='contained'
                    style={{display: (status > Number(BDStatus.DRAFT) && status < Number(BDStatus.APPROVED) && approvePermission) ? undefined : 'none'}}
                    color='error'
                    startIcon={<HighlightOffIcon />}
                    onClick={handleReject}
                    className={classes.MbtnSearch}>
                  ไม่อนุมัติ
                </Button>
              </Box>
            </Box>
            <ModalBacodeTransferItem id='' typeDiscount={valueRadios} action={action} userPermission={userPermission}/>
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
      <SnackbarStatus open={openPopupModal} onClose={handleClosePopup} isSuccess={true} contentMsg={textPopup} />
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError='กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง'
      />
      <ModalCheckStock
        open={openCheckStock}
        onClose={() => {
          setOpenCheckStock(false);
        }}
      />
      <ModalCheckPrice open={openModalCheck} onClose={handleCloseModalCheck} products={listProducts} />
      <ConfirmCloseModel open={openModalClose} onClose={() => setOpenModalClose(false)} onConfirm={handleClose} />
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
