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
    marginRight: "10px !important",
  },
  MbtnApprove: {
    borderRadius: "4px !important",
    marginRight: "10px !important",
  },
  MbtnClose: {
    borderRadius: "4px !important",
  },
  MtextFieldBrowse: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      border: "2px dashed #36C690 !important",
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
    "& .css-ieen6m-MuiInputBase-input-MuiOutlinedInput-input": {
      textAlign: "right",
    },
  },

  Mselect: {
    "& .css-y4ygc1-MuiInputBase-root-MuiOutlinedInput-root": {
      borderRadius: "10px !important",
    },
  },
});

export { useStyles };
