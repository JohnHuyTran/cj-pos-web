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
});

export { useStyles };
