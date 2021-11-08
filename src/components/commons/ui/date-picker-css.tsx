import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  Mdatepicker: {
    "& .MuiOutlinedInput-input": {
      padding: "8px 14px !important",
    },
    "& .MuiIconButton-root": {
      color: "#CBD4DB !important",
    },
  },
  // MkeyboardDatePicker: {
  //   "& .MuiPickersDay-dayS": {
  //     backgroundColor: "#36C690",
  //   },
  // },
});

export { useStyles };
