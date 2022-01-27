import React, { ReactElement, useEffect } from 'react';
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
} from '../../store/slices/barcode-discount-slice';
import {
  approveBarcodeDiscount,
  cancelBarcodeDiscount,
  saveDraftBarcodeDiscount,
  checkStockBalance,
} from '../../services/barcode-discount';
import BarcodeDiscountPopup from './barcode-discount-popup';
import AlertError from '../commons/ui/alert-error';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
import { objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action } from '../../utils/enum/common-enum';
import ModalCheckStock from './modal-check-stock';
import ModalCheckPrice from './modal-check-price';
interface Props {
  action: Action | Action.INSERT;
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  onClickClose: () => void;
  setPopupMsg?: any;
  onSearchBD?: () => void;
}

const _ = require('lodash');

export default function ModalCreateBarcodeDiscount({
  isOpen,
  onClickClose,
  setOpenPopup,
  action,
  setPopupMsg,
  onSearchBD,
}: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);

  const [valueRadios, setValueRadios] = React.useState<string>('percent');
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const classes = useStyles();

  const [openModelAddItems, setOpenModelAddItems] = React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalCheck, setOpenModalCheck] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [openCheckStock, setOpenCheckStock] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<number>(0);
  const [listProducts, setListProducts] = React.useState<object[]>([]);
  const dispatch = useAppDispatch();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  const payloadBarcodeDiscount = useAppSelector((state) => state.barcodeDiscount.createDraft);
  const dataDetail = useAppSelector((state) => state.barcodeDiscount.dataDetail);
  const checkStocks = useAppSelector((state) => state.barcodeDiscount.checkStock);

  //get detail from search
  const barcodeDiscountDetail = useAppSelector((state) => state.barcodeDiscountDetailSlice.barcodeDiscountDetail.data);

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
    dispatch(updateAddItemsState({}));
    dispatch(
      updateDataDetail({
        id: '',
        documentNumber: '',
        status: 0,
      })
    );
    dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, requesterNote: '' }));
    setOpen(false);
    onClickClose();
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
          percentDiscount: barcodeDiscountDetail.percentDiscount,
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

  const handleCreateDraft = async (sendRequest: boolean) => {
    const data = [...payloadBarcodeDiscount.products];
    if (payloadBarcodeDiscount.products.length !== 0) {
      const check = data.every((item) => {
        if (payloadBarcodeDiscount.percentDiscount) {
          if (item.requestedDiscount <= 0 || item.requestedDiscount > 100) return false;
        }
        if (stringNullOrEmpty(item.expiredDate)) return false;
        if (item.numberOfDiscounted <= 0) {
          return false;
        } else {
          return item.requestedDiscount > 0 && item.requestedDiscount <= item.price;
        }
      });

      if (check) {
        const rsCheckStock = await handleCheckStock();
        if (rsCheckStock) {
          await dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, validate: false }));
          try {
            const body = !!dataDetail.id
              ? { ...payloadBarcodeDiscount, id: dataDetail.id, documentNumber: dataDetail.documentNumber }
              : payloadBarcodeDiscount;
            const rs = await saveDraftBarcodeDiscount(body);
            if (rs.code === 201) {
              if (!sendRequest) {
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
        const dt = data.map((preData) => {
          const item = {
            id: preData.barcode,
            errorDiscount: '',
            errorNumberOfDiscounted: '',
            errorExpiryDate: '',
          };

          if (payloadBarcodeDiscount.percentDiscount) {
            if (preData.requestedDiscount <= 0 || preData.requestedDiscount > 100 || !preData.requestedDiscount) {
              item.errorDiscount = 'ส่วนลดต้องมากกว่าหรือเท่ากับ 0 และน้อยกว่า 100';
            }
          } else {
            if (
              preData.requestedDiscount <= 0 ||
              preData.requestedDiscount > preData.price ||
              !preData.requestedDiscount
            ) {
              item.errorDiscount = 'ราคาส่วนลดต้องมากกว่าหรือเท่ากับ 0 และน้อยกว่าราคาสินค้า';
            }
          }
          if (preData.numberOfDiscounted <= 0 || !preData.numberOfDiscounted) {
            item.errorNumberOfDiscounted = 'ค่าต้องมากกว่า 0';
          }
          if (!preData.expiredDate) {
            item.errorExpiryDate = 'ค่าไม่ว่างเปล่า';
          }
          return item;
        });

        dispatch(updateErrorList(dt));

        dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, validate: true }));
        setOpenModalError(true);
      }
    }
  };

  const handleSendRequest = () => {
    handleCreateDraft(true);
  };

  const handleSendForApproval = async (id: string) => {
    try {
      const rs = await approveBarcodeDiscount(id);
      if (rs.code === 200) {
        dispatch(
          updateDataDetail({
            ...dataDetail,
            status: 2,
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

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={!!true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
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
                -
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
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="discount"
                    value={valueRadios}
                    defaultValue={'percent'}
                    name="radio-buttons-group"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string) => {
                      handleChangeRadio(event);
                    }}
                  >
                    <FormControlLabel value="percent" control={<Radio />} label="ยอดลดเป็นเปอร์เซ็น (%)" />
                    <FormControlLabel value="amount" control={<Radio />} label="ยอดลดเป็นจำนวนเงิน (บาท)" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Box sx={{ display: 'flex', marginBottom: '18px', marginTop: '20px' }}>
              <Box>
                <Button
                  id="btnAddItem"
                  variant="contained"
                  color="info"
                  className={classes.MbtnSearch}
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={handleOpenAddItems}
                  sx={{ width: 126 }}
                  disabled={status > 1}
                >
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<SaveIcon />}
                  disabled={status > 1 || !payloadBarcodeDiscount.products.length}
                  onClick={() => handleCreateDraft(false)}
                  className={classes.MbtnSearch}
                >
                  บันทึก
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ margin: '0 17px' }}
                  disabled={status > 1 || !payloadBarcodeDiscount.products.length}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleSendRequest}
                  className={classes.MbtnSearch}
                >
                  ขออนุมัติ
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={status > 1}
                  startIcon={<HighlightOffIcon />}
                  onClick={handleOpenCancel}
                  className={classes.MbtnSearch}
                >
                  ยกเลิก
                </Button>
              </Box>
            </Box>
            <ModalBacodeTransferItem id="" typeDiscount={valueRadios} action={action} />
          </Box>
        </DialogContent>
      </Dialog>

      <ModalAddItems open={openModelAddItems} onClose={handleModelAddItems}></ModalAddItems>
      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onDeleteAction={handleDeleteDraft}
        barCode={dataDetail.documentNumber}
      />
      <BarcodeDiscountPopup open={openPopupModal} onClose={handleClosePopup} contentMsg={textPopup} />
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError="กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง"
      />
      <ModalCheckStock
        open={openCheckStock}
        onClose={() => {
          setOpenCheckStock(false);
        }}
      />
      <ModalCheckPrice open={openModalCheck} onClose={handleCloseModalCheck} products={listProducts} />
    </div>
  );
}
