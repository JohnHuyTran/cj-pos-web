import red from "@mui/material/colors/red";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  MbtnBrowse: {
    position: "absolute",
    borderRadius: "8px !important",
  },
  MbtnPrint: {
    borderRadius: "4px !important",
  },
  MbtnSave: {
    backgroundColor: "#FBA600 !important",
    borderRadius: "4px !important",
    marginLeft: "10px !important",
  },
  MbtnApprove: {
    borderRadius: "4px !important",
    marginLeft: "10px !important",
  },
  MbtnClose: {
    borderRadius: "4px !important",
  },
  MtextFieldBrowse: {
    "& .MuiOutlinedInput-root": {
      //input
      borderRadius: "5px !important",
      border: "1px dashed #36C690 !important",
      padding: "4px !important",
      minWidth: "235px",
    },
    "& .MuiOutlinedInput-root input::placeholder": {
      color: "#676767 !important",
      fontSize: "12px",
    },
  },
  MdataGrid: {
    "& .MuiDataGrid-root": {
      fontFamily: "Kanit",
      borderRadius: "10px !important",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#36C690",
      fontWeight: "600 !important",
    },
    "& .row-style--diff": {
      color: red["700"],
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px",
    },
    //TextField
    "& .css-ieen6m-MuiInputBase-input-MuiOutlinedInput-input": {
      textAlign: "right",
    },
    "& .css-ieen6m-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled": {
      "-webkit-text-fill-color": "#676767",
      backgroundColor: "#EAEBEB  !important",
      fontSize: "0.875rem !important",
      padding: "4px !important",
    },
    "& .MuiTypography-body2": {
      fontFamily: "Kanit",
    },
  },

  Mselect: {
    "& .css-y4ygc1-MuiInputBase-root-MuiOutlinedInput-root": {
      borderRadius: "10px !important",
    },
  },
});

export { useStyles };
