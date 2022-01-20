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
} from '../../store/slices/barcode-discount-slice';
import {
  approveBarcodeDiscount,
  cancelBarcodeDiscount,
  saveDraftBarcodeDiscount,
} from '../../services/barcode-discount';
import BarcodeDiscountPopup from './barcode-discount-popup';
import AlertError from '../commons/ui/alert-error';
import { updateAddItemsState } from '../../store/slices/add-items-slice';
interface Props {
  isOpen: boolean;
  setOpenPopup: (openPopup: boolean) => void;
  onClickClose: () => void;
}

export default function ModalCreateBarcodeDiscount({
  isOpen,
  onClickClose,
  setOpenPopup,
}: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [valueRadios, setValueRadios] = React.useState<string>('percent');
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const classes = useStyles();

  const [openModelAddItems, setOpenModelAddItems] =
    React.useState<boolean>(false);
  const [openPopupModal, setOpenPopupModal] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [textPopup, setTextPopup] = React.useState<string>('');
  const [status, setStatus] = React.useState<number>(0);
  const dispatch = useAppDispatch();
  const payloadBarcodeDiscount = useAppSelector((state) => state.barcodeDiscount.createDraft);
  const dataDetail = useAppSelector((state) => state.barcodeDiscount.dataDetail);

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

  const handdleClosePopup = () => {
    setOpenPopupModal(false);
  };

  const handleCloseModalError = () => {
    setOpenModalError(false);
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
    dispatch(saveBarcodeDiscount({ ...payloadBarcodeDiscount, requestorNote: '' }));
    setOpen(false);
    onClickClose();
  };

  useEffect(() => {
    setStatus(dataDetail.status);
  }, [dataDetail.status]);

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

  const handleCreateDraft = async (sendRequest:boolean) => {
    const data = [...payloadBarcodeDiscount.products];
    if (payloadBarcodeDiscount.products.length !== 0) {
      const check = data.every((item) => {
        if (payloadBarcodeDiscount.percentDiscount) {
          if (item.RequestedDiscount <= 0 || item.RequestedDiscount > 100)
            return false;
        }
        if (item.NumberOfDiscounted <= 0) {
          return false;
        } else {
          return (
            item.RequestedDiscount > 0 && item.RequestedDiscount <= item.price
          );
        }
      });

      if (check) {
        await dispatch(
          saveBarcodeDiscount({ ...payloadBarcodeDiscount, validate: false })
        );
        try {
          const body = !!dataDetail.id
            ? { ...payloadBarcodeDiscount, id: dataDetail.id, documentNumber: dataDetail.documentNumber }
            : payloadBarcodeDiscount;
          const rs = await saveDraftBarcodeDiscount(body);       
          if (rs.code === 201) { 
            if (!sendRequest) {
              setOpenPopupModal(true);
              setTextPopup('คุณได้บันทึกข้อมูลเรียบร้อยแล้ว');
            }
            !dataDetail.id && dispatch(
              updateDataDetail({
                id: rs.data.id,
                documentNumber: rs.data.documentNumber,
                status: rs.data.status,
              })
              );
              if (rs.data.status === 1 && sendRequest){
                handleSendForApproval(rs.data.id);
              }
          } else {
            setOpenModalError(true);
          }
        } catch (error) {
          setOpenModalError(true);
        }
      } else {
        dispatch(
          saveBarcodeDiscount({ ...payloadBarcodeDiscount, validate: true })
        );
        setOpenModalError(true);
      }
    }
  };

  const handleSendRequest = () => {
    if (status) {
      handleSendForApproval(dataDetail.id);
    } else {
      handleCreateDraft(true);
    }
  };

  const handleSendForApproval = async(id: string)=>{
    try {
      const rs = await approveBarcodeDiscount(id);
      if (rs.code === 200) {
        setOpenPopupModal(true);
        setTextPopup('คุณได้อนุมัติส่วนลดสินค้าเรียบร้อยแล้ว');
        dispatch(updateDataDetail({ ...dataDetail, status: 2 }));
      } else {
        setOpenModalError(true);
      }
    } catch (error) {
      setOpenModalError(true);
    }  
  }

  const handleDeleteDraft = async () => {
    if (status) {
      try {
        const rs = await cancelBarcodeDiscount(dataDetail.id);  
        if (rs.status === 200) {
          setOpenPopup(true);
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
      handleClose();
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={!!true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography sx={{ fontSize: '1em' }}>
            ส่วนลดสินค้า
          </Typography>
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
                {moment(createDate).format('DD/MM/YYYY')}
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
              <Grid item xs={8}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="discount"
                    value={valueRadios}
                    defaultValue={'percent'}
                    name="radio-buttons-group"
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      value: string
                    ) => {
                      handleChangeRadio(event);
                    }}
                  >
                    <FormControlLabel
                      value="percent"
                      control={<Radio />}
                      label="ยอดลดเป็นเปอร์เซ็น (%)"
                    />
                    <FormControlLabel
                      value="amount"
                      control={<Radio />}
                      label="ยอดลดเป็นจำนวนเงิน (บาท)"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Box
              sx={{ display: 'flex', marginBottom: '18px', marginTop: '20px' }}
            >
              <Box>
                <Button
                  id="btnAddItem"
                  variant="contained"
                  color="info"
                  className={classes.MbtnPrint}
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={handleOpenAddItems}
                  sx={{ width: 200 }}
                >
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: 'auto' }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<SaveIcon />}
                  disabled={status > 1}
                  onClick={() => handleCreateDraft(false)}
                >
                  บันทึก
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ margin: '0 17px' }}
                  disabled={status > 1}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleSendRequest}
                >
                  ขออนุมัติ
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={status > 1}
                  startIcon={<HighlightOffIcon />}
                  onClick={handleOpenCancel}
                >
                  ยกเลิก
                </Button>
              </Box>
            </Box>
            <ModalBacodeTransferItem id="" typeDiscount={valueRadios} />
          </Box>
        </DialogContent>
      </Dialog>

      <ModalAddItems
        open={openModelAddItems}
        onClose={handleModelAddItems}
      ></ModalAddItems>
      <ModelConfirm
        open={openModalCancel}
        onClose={handleCloseModalCancel}
        onDeleteAction={handleDeleteDraft}
        barCode={dataDetail.documentNumber}
      />
      <BarcodeDiscountPopup
        open={openPopupModal}
        onClose={handdleClosePopup}
        contentMsg={textPopup}
      />
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError="กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง"
      />
    </div>
  );
}
