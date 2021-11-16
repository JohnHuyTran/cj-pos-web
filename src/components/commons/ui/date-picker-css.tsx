import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  Mdatepicker: {
    "& .MuiOutlinedInput-input": {
      padding: "8px 0px !important",
    },
    "& .MuiIconButton-root": {
      color: "#CBD4DB !important",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: "0px !important",
    },
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: "0px !important",
    },
  },

  // MkeyboardDatePicker: {
  //   "& .MuiPickersDay-dayS": {
  //     backgroundColor: "#36C690",
  //   },
  // },
});

export { useStyles };
