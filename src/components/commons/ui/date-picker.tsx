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
  // const [selectedDate, setSelectedDate] = React.useState<Date | null>(
  //   new Date('2014-08-18T21:11:54'),
  // );
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(
    moment().add(0, "years")
  );

  const handleDateChange = (date: Date | null) => {
    console.log("newdate: ", date);
    setSelectedDate(date);
    props.onClickDate(date);
  };

  return (
    <div>
      <MuiPickersUtilsProvider utils={OverwriteMomentBE} locale="th">
        <ThemeProvider theme={defaultMaterialTheme}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD/MM/YYYY"
            value={selectedDate}
            onChange={handleDateChange}
            autoOk
            inputVariant="outlined"
            className={classes.Mdatepicker}
            fullWidth
          />
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DatePickerComponent;
