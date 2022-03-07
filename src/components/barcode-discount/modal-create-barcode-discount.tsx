import React, { ReactElement, useEffect, useState } from 'react';
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
  FormControl, Link,
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
import { Action, BDStatus, DateFormat } from '../../utils/enum/common-enum';
import ModalCheckStock from './modal-check-stock';
import ModalCheckPrice from './modal-check-price';
import ConfirmCloseModel from '../commons/ui/confirm-exit-model';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { ACTIONS } from "../../utils/enum/permission-enum";
import ModalReject from "./modal-reject";
import { PrintSharp } from "@mui/icons-material";
import ModalConfirmPrintedBarcode from "./modal-confirm-printed-barcode";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { getReasonForPrintText } from "../../utils/enum/barcode-discount-enum";
import { getBarcodeDiscountDetail } from "../../store/slices/barcode-discount-detail-slice";

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
  const [printPermission, setPrintPermission] = useState<boolean>((userPermission != null && userPermission.length > 0)
    ? userPermission.includes(ACTIONS.CAMPAIGN_BD_PRINT) : false);
  //print barcode
  const barcodeDiscountPrint = useAppSelector((state) => state.barcodeDiscountPrintSlice.state);
  const printInDetail = useAppSelector((state) => state.barcodeDiscountPrintSlice.inDetail);
  const [valuePrints, setValuePrints] = React.useState<any>({
    action: Action.INSERT,
    dialogTitle: 'พิมพ์บาร์โค้ด',
    printNormal: true,
    printInDetail: false,
    ids: '',
    lstProductNotPrinted: [],
    lstProductPrintAgain: []
  });
  const [openModalPrint, setOpenModalPrint] = React.useState(false);
  const [printHistoryRows, setPrintHistoryRows] = React.useState<any>([]);

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
            unitPrice: item.price || 0,
            discount: item.requestedDiscount || 0,
            qty: item.numberOfDiscounted || 0,
            numberOfApproved: item.numberOfApproved || 0,
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
      //print history
      const printHistory = barcodeDiscountDetail.printHistory;
      if (printHistory && printHistory.length > 0) {
        let rows = printHistory.map((itemH: any, index: number) => {
          return {
            id: index,
            index: index + 1,
            sequence: itemH.sequence,
            printBy: itemH.printBy,
            position: itemH.position,
            printingReason: (1 == itemH.printingTime) ? getReasonForPrintText('1') : getReasonForPrintText(itemH.printingReason),
            printingTime: itemH.printingTime,
            printedTime: moment(itemH.printedTime).format(DateFormat.DATE_TIME_DISPLAY_FORMAT),
            numberOfPrinting: itemH.numberOfPrinting,
            listOfProduct: itemH.listOfProduct
          };
        });
        setPrintHistoryRows(rows);
      }
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
          if (stringNullOrEmpty(preData.expiredDate)) {
            isValid = false;
            item.errorExpiryDate = 'กรุณาระบุวันหมดอายุ';
          } else {
            if (moment(preData.expiredDate).isSameOrBefore(moment(new Date()), 'day')) {
              isValid = false;
              item.errorExpiryDate = 'วันที่หมดอายุต้องใหญ่กว่านี้วันนี้';
            }
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

  const handleCreateDraft = async (sendRequest: boolean) => {
    if (validate(false)) {
      const rsCheckStock = await handleCheckStock();
      if (rsCheckStock) {
        await dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount }));
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
    } catch (error) {
    }
  };

  const handleReject = () => {
    handleOpenModalReject();
  };

  const handleOpenModalPrint = () => {
    setOpenModalPrint(true);
  };

  const handleCloseModalPrint = () => {
    setOpenModalPrint(false);
  };

  const onPrintedBarcode = async () => {
    let lstProductNotPrinted = [];
    let lstProductPrintAgain = [];
    let products = _.cloneDeep(barcodeDiscountPrint);
    if (Number(BDStatus.BARCODE_PRINTED) == status) {
      for (const itPro of products) {
        if (!stringNullOrEmpty(itPro.expiryDate) && moment(itPro.expiryDate).isSameOrAfter(moment(new Date()), 'day')) {
          itPro.barcode = itPro.barCode;
          itPro.productName = itPro.barcodeName;
          lstProductPrintAgain.push(itPro);
        }
      }
    } else {
      if (barcodeDiscountPrint && barcodeDiscountPrint.length > 0 && printInDetail) {
        for (const itPro of products) {
          if (!stringNullOrEmpty(itPro.expiryDate) && moment(itPro.expiryDate).isBefore(moment(new Date()), 'day')) {
            itPro.barcode = itPro.barCode;
            itPro.productName = itPro.barcodeName;
            lstProductNotPrinted.push(itPro);
          }
        }
      }
    }
    let ids = [];
    ids.push(dataDetail.id);
    await setValuePrints({
      ...valuePrints,
      action: Action.INSERT,
      dialogTitle: 'พิมพ์บาร์โค้ด',
      ids: ids,
      printNormal: lstProductNotPrinted.length === 0 && lstProductPrintAgain.length === 0,
      printInDetail: printInDetail,
      lstProductNotPrinted: lstProductNotPrinted,
      lstProductPrintAgain: lstProductPrintAgain
    });
    handleOpenModalPrint();
  };

  const onConfirmModalPrint = async () => {
    dispatch(
      updateDataDetail({
        ...dataDetail,
        status: Number(BDStatus.BARCODE_PRINTED),
      })
    );
    dispatch(getBarcodeDiscountDetail(dataDetail.id));
    if (onSearchBD) onSearchBD();
  };

  const onShowPrintedHistory = async (sequence: any) => {
    if (printHistoryRows && printHistoryRows.length > 0 && printInDetail) {
      let lstProductPrintAgain = [];
      let printHistory = _.cloneDeep(printHistoryRows).find((it: any) => it.sequence === sequence);
      if (printHistory.listOfProduct && printHistory.listOfProduct.length) {
        for (const itPro of printHistory.listOfProduct) {
          itPro.barcode = itPro.productBarcode;
          lstProductPrintAgain.push(itPro);
        }
        let ids = [];
        ids.push(dataDetail.id);
        await setValuePrints({
          ...valuePrints,
          action: Action.VIEW,
          dialogTitle: 'รายการส่วนลดที่พิมพ์',
          ids: ids,
          printNormal: false,
          printInDetail: printInDetail,
          lstProductPrintAgain: lstProductPrintAgain
        });
        handleOpenModalPrint();
      }
    }
  }

  const printHistoryColumns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      headerAlign: 'center',
      disableColumnMenu: false,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'ลำดับ'}</b>
            </Typography>
          </div>
        );
      }
    },
    {
      field: 'printBy',
      headerName: 'ชื่อผู้ทำรายการ',
      headerAlign: 'center',
      flex: 0.9,
      disableColumnMenu: false,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'ชื่อผู้ทำรายการ'}</b>
            </Typography>
          </div>
        );
      }
    },
    {
      field: 'position',
      headerName: 'ตำแหน่ง',
      headerAlign: 'center',
      flex: 1.1,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'ตำแหน่ง'}</b>
            </Typography>
          </div>
        );
      }
    },
    {
      field: 'printingReason',
      headerName: 'เหตุผลที่ทำการพิมพ์บาร์โค้ด',
      headerAlign: 'center',
      flex: 2,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'เหตุผลที่ทำการพิมพ์บาร์โค้ด'}</b>
            </Typography>
          </div>
        );
      }
    },
    {
      field: 'numberOfPrinting',
      headerName: 'รายการส่วนลดที่พิมพ์',
      headerAlign: 'center',
      align: 'center',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          <Link href="#" underline="always"
                onClick={() => onShowPrintedHistory(params.getValue(params.id, 'sequence') || '')}>
            {params.value}
          </Link>
        </Box>
      ),
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'รายการส่วนลด'}</b>
            </Typography>
            <Typography variant="body2" noWrap>
              <b>{'ที่พิมพ์'}</b>
            </Typography>
          </div>
        );
      }
    },
    {
      field: 'printingTime',
      headerName: 'พิมพ์ครั้งที่',
      headerAlign: 'center',
      align: 'center',
      flex: 0.8,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'พิมพ์ครั้งที่'}</b>
            </Typography>
          </div>
        );
      }
    },
    {
      field: 'printedTime',
      headerName: 'พิมพ์วันที่/เวลา',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      renderHeader: (params) => {
        return (
          <div style={{ color: '#36C690' }}>
            <Typography variant="body2" noWrap>
              <b>{'พิมพ์วันที่/เวลา'}</b>
            </Typography>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <Dialog open={open} maxWidth='xl' fullWidth>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={handleCloseModalCreate}>
          <Typography sx={{ fontSize: '1em' }}>ส่วนลดสินค้า</Typography>
          <StepperBar activeStep={status} setActiveStep={setStatus}/>
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
                      control={<Radio disabled={status > 1}/>}
                      label='ยอดลดเป็นเปอร์เซ็น (%)'
                    />
                    <FormControlLabel
                      value='amount'
                      control={<Radio disabled={status > 1}/>}
                      label='ยอดลดเป็นจำนวนเงิน (บาท)'
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Box >
            <Box sx={{ display: 'flex', marginBottom: '18px' }}>
              <Box>
                <Button
                  id='btnPrint'
                  variant='contained'
                  color='info'
                  className={classes.MbtnSearch}
                  onClick={onPrintedBarcode}
                  disabled={barcodeDiscountPrint && barcodeDiscountPrint.length == 0 && printInDetail && status == Number(BDStatus.BARCODE_PRINTED)}
                  startIcon={<PrintSharp/>}
                  sx={{ width: '208px' }}
                  style={{ display: (status >= Number(BDStatus.APPROVED) && status != Number(BDStatus.REJECT) && printPermission) ? undefined : 'none' }}
                >
                  พิมพบาร์โค้ด
                </Button>
                <Button
                  id='btnAddItem'
                  variant='contained'
                  color='info'
                  className={classes.MbtnSearch}
                  startIcon={<AddCircleOutlineOutlinedIcon/>}
                  onClick={handleOpenAddItems}
                  sx={{ width: 126 }}
                  style={{ display: (status >= Number(BDStatus.WAIT_FOR_APPROVAL) || approvePermission) ? 'none' : undefined }}
                  disabled={status > 1}>
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  id='btnSaveDraft'
                  variant='contained'
                  color='warning'
                  startIcon={<SaveIcon/>}
                  disabled={status > 1 || !payloadBarcodeDiscount.products.length}
                  style={{ display: (status >= Number(BDStatus.WAIT_FOR_APPROVAL) || approvePermission) ? 'none' : undefined }}
                  onClick={() => handleCreateDraft(false)}
                  className={classes.MbtnSearch}>
                  บันทึก
                </Button>
                <Button
                  id='btnSendForApproval'
                  variant='contained'
                  color='primary'
                  sx={{ margin: '0 17px' }}
                  disabled={status > 1 || !payloadBarcodeDiscount.products.length}
                  style={{ display: (status >= Number(BDStatus.WAIT_FOR_APPROVAL) || approvePermission) ? 'none' : undefined }}
                  startIcon={<CheckCircleOutlineIcon/>}
                  onClick={handleSendRequest}
                  className={classes.MbtnSearch}>
                  ขออนุมัติ
                </Button>
                <Button
                  id='btnCancel'
                  variant='contained'
                  color='error'
                  disabled={status > 1}
                  style={{ display: (status >= Number(BDStatus.WAIT_FOR_APPROVAL) || approvePermission) ? 'none' : undefined }}
                  startIcon={<HighlightOffIcon/>}
                  onClick={handleOpenCancel}
                  className={classes.MbtnSearch}>
                  ยกเลิก
                </Button>
                <Button
                  id='btnApprove'
                  sx={{ margin: '0 17px' }}
                  style={{ display: (status == Number(BDStatus.WAIT_FOR_APPROVAL) && approvePermission) ? undefined : 'none' }}
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
                  style={{ display: (status == Number(BDStatus.WAIT_FOR_APPROVAL) && approvePermission) ? undefined : 'none' }}
                  color='error'
                  startIcon={<HighlightOffIcon/>}
                  onClick={handleReject}
                  className={classes.MbtnSearch}>
                  ไม่อนุมัติ
                </Button>
              </Box>
            </Box>
            <Box>
              <ModalBacodeTransferItem id='' typeDiscount={valueRadios} action={action} userPermission={userPermission}/>
            </Box>
            <Box hidden={status !== Number(BDStatus.BARCODE_PRINTED)}>
              <Typography>ประวัติการพิมพ์บาร์โค้ด</Typography>
              <DataGrid rows={printHistoryRows}
                        columns={printHistoryColumns}
                        className={classes.MdataGridDetail}
                        disableColumnMenu
                        hideFooter
                        autoHeight
                        rowHeight={70}/>
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
        textError={'กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง'}
      />
      <ModalCheckStock
        open={openCheckStock}
        onClose={() => {
          setOpenCheckStock(false);
        }}
      />
      <ModalCheckPrice open={openModalCheck} onClose={handleCloseModalCheck} products={listProducts}/>
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
      <ModalConfirmPrintedBarcode onClose={handleCloseModalPrint}
                                  onConfirm={onConfirmModalPrint}
                                  open={openModalPrint}
                                  values={valuePrints}
      />
    </div>
  );
}
