//@ts-nocheck
import React, { useState } from "react";

import moment from "moment";
// npm i @date-io/moment@1.x moment
import OverwriteMomentBE from "./OverwriteMoment"; // choose your lib
import { useStyles } from "./date-picker-css";

import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

interface StateProps {
  onClickDate: any;
  value: any | Date | number | string;
  type?: string;
  minDateTo?: any | Date | number | string;
}

const defaultMaterialTheme = createTheme({
  palette: {
    primary: {
      main: "#36C690",
    },
  },
});

// export default function DatePickerComponent() {
const DatePickerComponent: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const today = new Date();
  // const [selectedDate, setSelectedDate] = React.useState(
  //   moment().add(0, "years")
  // );

  const handleDateChange = (date: Date | null) => {
    props.onClickDate(date);
  };

  let datePicker;
  if (props.type === "TO") {
    datePicker = (
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="DD/MM/YYYY"
        value={props.value}
        onChange={handleDateChange}
        autoOk
        inputVariant="outlined"
        className={classes.Mdatepicker}
        fullWidth
        minDate={props.minDateTo}
        maxDate={today}
        InputProps={{ readOnly: true }}
      />
    );
  } else {
    datePicker = (
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="DD/MM/YYYY"
        value={props.value}
        onChange={handleDateChange}
        autoOk
        inputVariant="outlined"
        className={classes.Mdatepicker}
        fullWidth
        maxDate={today}
        InputProps={{ readOnly: true }}
      />
    );
  }

  return (
    <div>
      <MuiPickersUtilsProvider utils={OverwriteMomentBE} locale="th">
        <ThemeProvider theme={defaultMaterialTheme}>{datePicker}</ThemeProvider>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DatePickerComponent;
