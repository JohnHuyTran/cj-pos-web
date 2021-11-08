//@ts-nocheck
import React, { useState } from "react";

import moment from "moment";
// npm i @date-io/moment@1.x moment
import OverwriteMomentBE from "./OverwriteMoment"; // choose your lib
import { useStyles } from "../../../styles/makeTheme";

import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

interface StateProps {
  onClickDate: any;
}

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
      </MuiPickersUtilsProvider>
      {/* <p>1. output form datepicker :: {selectedDate.format("DD/MM/YYYY")}</p>
      <p>
        2. output form datepicker (add 543) ::{" "}
        {moment(selectedDate).add(543, "year").format("DD/MM/YYYY")}
      </p> */}
    </div>
  );
};

export default DatePickerComponent;
