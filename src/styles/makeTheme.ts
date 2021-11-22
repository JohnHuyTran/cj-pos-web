import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  MtextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      padding: "4px 4px 4px 8px",
    },
  },
  Mselect: {
    "& .css-y4ygc1-MuiInputBase-root-MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      padding: "4px 4px 4px 8px",
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
  Mautocomplete: {
    "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
      padding: "4px !important",
    },
    "& .MuiAutocomplete-input": {
      padding: "2px 4px 2px 6px !important",
    },
  },
  MbtnClear: {
    backgroundColor: "#AEAEAE !important",
    borderRadius: "5px !important",
  },
  MbtnSearch: {
    borderRadius: "5px !important",
  },
  MtextFieldRemark: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      maxWidth: 300,
      fontSize: "14px",
      color: "#263238 !important",
    },
    "& .css-2vifws-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled": {
      // opacity: 0,
      color: "#263238 !important",
      "-webkit-text-fill-color": "rgb(0 0 0 / 100%)",
    },
  },
});

export { useStyles };
