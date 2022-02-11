//@ts-nocheck
import React, { useState } from 'react';
// npm i @date-io/moment@1.x moment
import OverwriteMomentBE from './OverwriteMoment'; // choose your lib
import { useStyles } from './date-picker-css';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TimeIcon from '@mui/icons-material/AccessTime';
interface StateProps {
  onClickTime: any;
  value: any | Date | number | string;
  error?: boolean;
}

const defaultMaterialTheme = createTheme({
  palette: {
    primary: {
      main: '#36C690',
    },
  },
  typography: {
    fontFamily: 'Kanit',
  },
});

const TimePickerComponent: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const handleTimeChange = (date: any) => {
    props.onClickTime(date);
  };

  let timePicker = (
    <KeyboardTimePicker
      disableToolbar
      clearable
      autoOk
      ampm={false}
      fullWidth
      variant="inline"
      inputVariant="outlined"
      format="HH:mm น."
      className={props.error ? classes.MdatepickerError : classes.Mdatepicker}
      value={props.value}
      onChange={handleTimeChange}
      InputProps={{
        endAdornment: (
          <IconButton size="small" onClick={() => handleTimeChange(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        ),
        readOnly: true,
      }}
      keyboardIcon={<TimeIcon />}
      InputAdornmentProps={{
        position: 'start',
      }}
      placeholder="00:00 น."
    />
  );

  return (
    <div>
      <MuiPickersUtilsProvider utils={OverwriteMomentBE} locale="th">
        <ThemeProvider theme={defaultMaterialTheme}>{timePicker}</ThemeProvider>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default TimePickerComponent;
