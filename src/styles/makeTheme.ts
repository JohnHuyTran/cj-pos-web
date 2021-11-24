import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  MtextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      // padding: "2x 2px 2px 6px",
      fontSize: "14px",
    },
  },
  MtextFieldNumber: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      fontSize: "14px",
      textAlignLast: "end !important",
    },
  },
  Mselect: {
    "& .css-y4ygc1-MuiInputBase-root-MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      // padding: "4px 4px 4px 8px",
    },
  },
  MdataGrid: {
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#36C690",
      fontWeight: "600 !important",
    },
    "& .MuiDataGrid-root": {
      fontFamily: "Kanit",
      borderRadius: "10px !important",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px",
    },
  },

  MdataGridPaginationTop: {
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#36C690",
      fontWeight: "600 !important",
    },
    "& .MuiDataGrid-root": {
      fontFamily: "Kanit",
      borderRadius: "10px !important",
      display: "flex !important",
      flexDirection: "column-reverse",
    },
    "& .MuiDataGrid-footerContainer": {
      borderBottom: "1px solid #cbd4db !important",
    },
  },
  MdataGridNew: {
    "& .MuiDataGrid-renderingZone": {
      maxHeight: "none !important",
    },
    "& .MuiDataGrid-cell": {
      lineHeight: "unset !important",
      maxHeight: "none !important",
      whiteSpace: "normal",
    },
    "& .MuiDataGrid-row": {
      maxHeight: "none !important",
    },
  },
  Mautocomplete: {
    "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
      padding: "1.5px !important",
    },
    "& .MuiAutocomplete-input": {
      // padding: "2px 4px 2px 6px !important",
    },
  },
  MbtnClear: {
    borderRadius: "5px !important",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#676767",
    },
  },

  MbtnSearch: {
    borderRadius: "5px !important",
  },
  MbtnSave: {
    width: "125px",
    // backgroundColor: "#FBA600 !important",
    borderRadius: "4px !important",
    marginLeft: "10px !important",
    boxShadow: "none !important",
  },
  MbtnApprove: {
    width: "125px",
    borderRadius: "4px !important",
    marginLeft: "10px !important",
    boxShadow: "none !important",
  },
  MbtnBrowse: {
    width: "125px",
    borderRadius: "8px !important",
    boxShadow: "none !important",
  },
  MtextFieldRemark: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      fontSize: "14px",
      color: "#263238 !important",
    },
    "& .css-2vifws-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled": {
      // opacity: 0,
      color: "#263238 !important",
      "-webkit-text-fill-color": "rgb(0 0 0 / 100%)",
    },
  },
  MStepper: {
    "& .css-4q7q78-MuiSvgIcon-root-MuiStepIcon-root.Mui-active": {
      color: "#DDDDDD",
    },
  },
});

export { useStyles };
