import React, { useState, ReactElement } from 'react';
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
import { saveBarcodeDiscount } from '../../store/slices/barcode-discount-slice';
import { saveDraftBarcodeDiscount } from '../../services/barcode-discount';
import BarcodeDiscountPopup from './barcode-discount-popup';
import AlertError from '../commons/ui/alert-error';
import { stringNullOrEmpty } from '../../utils/utils';
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}
interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

export default function ModalCreateBarcodeDiscount({
  isOpen,
  onClickClose,
}: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const [page, setPage] = React.useState(0);
  const [piStatus, setPiStatus] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [valueRadios, setValueRadios] = React.useState<string>('percent');
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const classes = useStyles();

  const [openModelAddItems, setOpenModelAddItems] =
    React.useState<boolean>(false);
  const [openPopupSave, setOpenPopupSave] = React.useState<boolean>(false);
  const [openModalError, setOpenModalError] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<number>(0);
  const dispatch = useAppDispatch();
  const payloadBarcodeDiscount = useAppSelector(
    (state) => state.barcodeDiscount.createDraft
  );
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleCancel = () => {
    setOpenModalCancel(true);
  };
  const handleCloseModalCancel = () => {
    setOpenModalCancel(false);
  };

  const handleSendRequest = () => {
    setStatus(2);
  };

  const handdleClosePopup = () => {
    setOpenPopupSave(false);
  };

  const handleCloseModalError = () => {
    setOpenModalError(false);
  };

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  const handleCreateDraft = async () => {
    const data = payloadBarcodeDiscount.products;

    if (data.length !== 0) {
      for (const item of data) {
        if (payloadBarcodeDiscount.percentDiscount) {
          if (item.discount < 0 || item.discount > 100) {
            item.errorDiscount =
              'ส่วนลดต้องมากกว่าหรือเท่ากับ 0 และน้อยกว่า 100';
          }
        } else {
          if (item.discount < 0 || item.discount > item.price) {
            item.errorDiscount =
              'ราคาส่วนลดต้องมากกว่าหรือเท่ากับ 0 และน้อยกว่าราคาสินค้า';
          }
        }
        if (item.qty < 0) {
          item.errorQty = 'ค่าต้องมากกว่า 0';
        }
        if (stringNullOrEmpty(item.expiryDate)) {
          item.errorExpiryDate = 'ค่าไม่ว่างเปล่า'
        }
      }
    }

    await dispatch(saveBarcodeDiscount({
      ...payloadBarcodeDiscount,
      products: data,
    }))

    console.log(payloadBarcodeDiscount);
    

    // try {
    //   const rs = await saveDraftBarcodeDiscount(payloadBarcodeDiscount);
    //   if (rs.code === 201) {
    //     setOpenPopupSave(true);
    //     setTimeout(() => {
    //       setOpenPopupSave(false);
    //     }, 3000);
    //   } else {
    //     setOpenModalError(true)

    //   }

    // } catch (error) {
    //   setOpenModalError(true)

    // }
  };
  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={!!true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography sx={{ fontSize: '1em' }}>
            ใบรับสินค้าจากผู้จำหน่าย
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
                -
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
                วันที่ขอส่วนลด
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
                ยอดลด : :
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
                  onClick={handleCreateDraft}
                >
                  เพิ่มสินค้า
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ margin: '0 17px' }}
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleSendRequest}
                >
                  เพิ่มสินค้า
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={status > 1}
                  startIcon={<HighlightOffIcon />}
                  onClick={handleCancel}
                >
                  เพิ่มสินค้า
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
        requesterId="4234213"
        barCode="234234235524"
      />
      <BarcodeDiscountPopup
        open={openPopupSave}
        onClose={handdleClosePopup}
        contentMsg="คุณได้บันทึกข้อมูลเรียบร้อยแล้ว"
      />
      <AlertError
        open={openModalError}
        onClose={handleCloseModalError}
        textError="กรอกข้อมูลไม่ถูกต้องหรือไม่ได้ทำการกรอกข้อมูลที่จำเป็น กรุณาตรวจสอบอีกครั้ง"
      />
    </div>
  );
}
