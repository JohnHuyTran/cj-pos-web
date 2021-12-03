import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  MtextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      // padding: "2x 2px 2px 6px",
    },
    '& .MuiOutlinedInput-root input::placeholder': {
      fontSize: '14px',
    },
  },
  MtextFieldNumber: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      fontSize: '14px',
      textAlignLast: 'end !important',
    },
    '& .css-wufqwl-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
      color: '#263238 !important',
      '-webkit-text-fill-color': 'rgb(0 0 0 / 100%)',
    },
  },
  Mselect: {
    '& .css-y4ygc1-MuiInputBase-root-MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      // padding: "4px 4px 4px 8px",
    },
  },
  MdataGridDetail: {
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#36C690',
      fontWeight: '600 !important',
    },
    '& .MuiDataGrid-root': {
      color: '#263238',
      fontFamily: 'Kanit',
      borderRadius: '20px !important',
      display: 'flex !important',
      flexDirection: 'column-reverse',
      '& .MuiDataGrid-main': {
        top: -16,
      },
      '& .MuiDataGrid-cell': {
        cursor: 'pointer',
      },
      '& .MuiDataGrid-cell:focus-within,& .MuiDataGrid-cell:focus': {
        outline: 'none',
      },
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px',
      fontSize: '14px',
    },
    '& .MuiTablePagination-toolbar': {
      color: '#AEAEAE',
      '& .MuiTypography-body2': {
        fontFamily: 'Kanit',
      },
    },
    '& .MuiDataGrid-footerContainer': {
      color: '#AEAEAE',
      '& MuiDataGrid-selectedRowCount': {
        fontFamily: 'Kanit !important',
      },
    },
  },

  MdataGridPaginationTop: {
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#36C690',
      fontWeight: '600 !important',
      whiteSpace: 'unset !important',
      // overflow: "unset !important",
    },
    '& .MuiDataGrid-root': {
      fontFamily: 'Kanit',
      borderRadius: '10px !important',
      display: 'flex !important',
      flexDirection: 'column-reverse',
      '& .MuiDataGrid-row': {
        maxHeight: 'none !important',
        '& .MuiDataGrid-cell': {
          cursor: 'pointer',
          maxHeight: 'none !important',
          display: 'flex',
          alignItems: 'center',
        },
      },
      '& .MuiDataGrid-cell:focus-within,& .MuiDataGrid-cell:focus,& .MuiDataGrid-columnHeader:focus-within,& .MuiDataGrid-columnHeader:focus':
        {
          outline: 'none',
        },
    },
    '& .MuiDataGrid-footerContainer': {
      borderBottom: '1px solid #E5E5E5 !important',
      // height: '50px',
    },
    '& .MuiTablePagination-toolbar': {
      color: '#AEAEAE',
    },

    // '& .MuiDataGrid-renderingZone': {
    //   maxHeight: 'none !important',
    // },
    // "& .MuiDataGrid-cell": {
    //   lineHeight: "unset !important",
    //   maxHeight: "none !important",
    //   whiteSpace: "unset !important",
    //   overflow: "unset !important",
    // },
    // "& .MuiDataGrid-row": {
    //   maxHeight: "none !important",
    // },
    //column wrap text
    // "& .MuiDataGrid-columnHeaderTitleContainer": {
    //   lineHeight: "normal !important",
    //   whiteSpace: "unset !important",
    //   overflow: "unset !important",
    // },
  },
  MdataGridNew: {
    //column wrap text
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      lineHeight: 'normal !important',
      whiteSpace: 'unset !important',
      overflow: 'unset !important',
    },
  },
  Mautocomplete: {
    '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
      padding: '1.5px !important',
    },
    '& .MuiAutocomplete-input': {
      // padding: "2px 4px 2px 6px !important",
    },
  },
  MbtnClear: {
    borderRadius: '5px !important',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#676767',
    },
  },
  MbtnSearch: {
    borderRadius: '5px !important',
  },
  MbtnSave: {
    width: '125px',
    // backgroundColor: "#FBA600 !important",
    borderRadius: '4px !important',
    marginLeft: '10px !important',
    boxShadow: 'none !important',
  },
  MbtnApprove: {
    width: '125px',
    borderRadius: '4px !important',
    marginLeft: '10px !important',
    boxShadow: 'none !important',
  },
  MbtnBrowse: {
    width: '125px',
    borderRadius: '8px !important',
    boxShadow: 'none !important',
  },
  MtextFieldRemark: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      fontSize: '14px',
      color: '#263238 !important',
    },
    '& .css-2vifws-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
      // opacity: 0,
      color: '#263238 !important',
      '-webkit-text-fill-color': 'rgb(0 0 0 / 100%)',
    },
  },
  MStepper: {
    '& .css-4q7q78-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
      color: '#DDDDDD',
    },
  },
  MtextFieldBrowse: {
    '& .MuiOutlinedInput-root': {
      //input
      borderRadius: '5px !important',
      border: '1px dashed #36C690 !important',
      padding: '0px 4px !important',
      minWidth: '235px',
    },
    '& .MuiOutlinedInput-root input::placeholder': {
      color: '#676767 !important',
      fontSize: '12px',
    },
  },
  MbtnPrint: {
    width: '200px',
    borderRadius: '4px !important',
  },
  MbtnClose: {
    width: '200px',
    borderRadius: '4px !important',
  },
});

export { useStyles };
