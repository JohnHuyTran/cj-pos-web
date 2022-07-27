import React, { Fragment, useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import moment from 'moment';
import NumberFormat from 'react-number-format';

//css
import { useStyles } from '../../../styles/makeTheme';

//modal
import { ApiError } from '../../../models/api-error-model';

//component
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import { cashStatementEdit } from '../../../services/accounting';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import AlertError from '../../commons/ui/alert-error';
import LoadingModal from '../../commons/ui/loading-modal';

const initialStateValues: any = {
  date: new Date(),
  cashOver: 0,
  cashShort: 0,
};
interface Props {
  open: boolean;
  onClose: () => void;
  payloadCash: any;
}

function ModalEditSearchList({ open, onClose, payloadCash }: Props) {
  const classes = useStyles();

  const date = new Date();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [values, setValues] = useState(initialStateValues);
  const [isValidateCash, setIsValidateCash] = useState(true);
  const [msgError, setMsgError] = useState('');
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [snackbarIsStatus, setSnackbarIsStatus] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [textError, setTextError] = useState('');
  const [openLoadingModal, setOpenLoadingModal] = useState(false);

  const handleDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    const removeCommar = value.replace(/\,/g, '');
    setValues({ ...values, [event.target.name]: removeCommar });
  };

  const validateCash = () => {
    const cashOver = Number(values.cashOver);
    const cashShort = Number(values.cashShort);
    if (cashOver === 0 && cashShort === 0) {
      setMsgError('กรอกจำนวนเงินไม่ถูกต้อง');
    } else if (cashOver > 0 && cashShort > 0) {
      setMsgError('จำนวนเงินต้องมี เงินขาดหรือเงินเกิน เท่านั้น');
    } else {
      return true;
    }
  };

  const handleSaveBtn = async () => {
    setOpenLoadingModal(true);
    const isValidateCashXX = validateCash();

    if (isValidateCashXX) {
      setIsValidateCash(true);

      const payloadSave: any = {
        id: payloadCash.id,
        cashDate: moment(startDate).startOf('day').toISOString(),
        cashOver: Number(values.cashOver),
        cashShort: Number(values.cashShort),
      };

      cashStatementEdit(payloadSave)
        .then((value) => {
          setShowSnackBar(true);
          setSnackbarIsStatus(true);
          setSnackBarMsg('บันทึก เรียบร้อยแล้ว');

          setTimeout(() => {
            onClose();
          }, 500);
        })
        .catch((error: ApiError) => {
          setOpenAlert(true);
          setTextError(error.message);
        })
        .finally(() => setOpenLoadingModal(false));
    } else {
      setIsValidateCash(false);
    }
  };

  const handleOnclose = () => {
    setMsgError('');
    setIsValidateCash(true);
    onClose();
  };

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    setValues({
      date: new Date(),
      cashOver: payloadCash ? payloadCash.cash2 : '0',
      cashShort: payloadCash ? payloadCash.cash1 : '0',
    });
    setStartDate(new Date());
  }, [open]);

  return (
    <Fragment>
      <Dialog open={open} maxWidth="sm" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleOnclose}>
          <Typography variant="h6">แก้ไขข้อมูล</Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={5} textAlign="right">
              <Typography variant="body1">วันที่ยอดขาย : </Typography>
            </Grid>
            <Grid item xs={5} textAlign="left">
              <DatePickerAllComponent
                onClickDate={handleDatePicker}
                value={startDate}
                type={'TO'}
                minDateTo={new Date()}
                maxDate={date.setDate(date.getDate() + 6)}
              />
            </Grid>
            <Grid item xs={5} textAlign="right" sx={{ mt: 1 }}>
              <Typography variant="body1">เงินขาด : </Typography>
            </Grid>
            <Grid item xs={5} textAlign="left" sx={{ mt: 1 }}>
              <NumberFormat
                name="cashShort"
                value={String(values.cashShort)}
                thousandSeparator={true}
                decimalScale={2}
                className={classes.MtextFieldNumber}
                customInput={TextField}
                onChange={handleChange}
                fullWidth
                fixedDecimalScale
                type="text"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: `${!isValidateCash ? '#F54949' : '#000000'}`,
                    },
                    '&:hover fieldset': {
                      borderColor: `${!isValidateCash ? '#F54949' : '#000000'}`,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={5} textAlign="right">
              <Typography variant="body1">เงินเกิน : </Typography>
            </Grid>
            <Grid item xs={5} textAlign="left">
              <NumberFormat
                name="cashOver"
                value={String(values.cashOver)}
                thousandSeparator={true}
                decimalScale={2}
                className={classes.MtextFieldNumber}
                customInput={TextField}
                onChange={handleChange}
                fullWidth
                fixedDecimalScale
                type="text"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: `${!isValidateCash ? '#F54949' : '#000000'}`,
                    },
                    '&:hover fieldset': {
                      borderColor: `${!isValidateCash ? '#F54949' : '#000000'}`,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="body1" color="error">
                {msgError ? msgError : ''}
              </Typography>
            </Grid>
          </Grid>

          <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
            <Button
              data-testid="testid-btnEdit"
              id="btnEdit"
              variant="contained"
              color="primary"
              size="large"
              className={classes.MbtnSearch}
              onClick={handleSaveBtn}
            >
              บันทึก
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <LoadingModal open={openLoadingModal} />
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={snackbarIsStatus}
        contentMsg={snackBarMsg}
      />
    </Fragment>
  );
}

export default ModalEditSearchList;
