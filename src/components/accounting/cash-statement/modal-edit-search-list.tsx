import React, { Fragment, useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import moment from 'moment';
import NumberFormat from 'react-number-format';

//css
import { useStyles } from '../../../styles/makeTheme';

//component
import DatePickerAllComponent from '../../commons/ui/date-picker-all';

const initialStateValues: any = {
  date: new Date(),
  cashOver: 0,
  cashShort: 0,
};
interface Props {
  open: boolean;
  onClose: () => void;
  payloadCash: any;
  payloadEdit: (value: any) => void;
}

function ModalEditSearchList({ open, onClose, payloadCash, payloadEdit }: Props) {
  const classes = useStyles();

  const date = new Date();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [values, setValues] = useState(initialStateValues);

  const handleDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    const removeCommar = value.replace(/\,/g, '');
    setValues({ ...values, [event.target.name]: removeCommar });
  };

  const handleSaveBtn = () => {
    const payloadSave: any = {
      date: moment(startDate).startOf('day').toISOString(),
      cashOver: Number(values.cashOver),
      cashShort: Number(values.cashShort),
    };
    payloadEdit(payloadSave);
    onClose();
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
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
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
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ justifyContent: 'center', mt: 4 }}>
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
    </Fragment>
  );
}

export default ModalEditSearchList;
