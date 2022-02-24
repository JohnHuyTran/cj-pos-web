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
    '& .css-wufqwl-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
      // opacity: 0,
      color: '#263238 !important',
      '-webkit-text-fill-color': 'rgb(0 0 0 / 100%)',
    },
  },
  MtextFieldDetail: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      minHeight: '20px !important',
      padding: '0px 0px 0px 5px',
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
  MtextFieldNumberError: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      fontSize: '14px',
      textAlignLast: 'end !important',
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'red',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'red',
      },
    },
    '& .css-wufqwl-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
      color: '#263238 !important',
      '-webkit-text-fill-color': 'rgb(0 0 0 / 100%)',
    },
  },
  MtimeTextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      padding: '6px 6px 6px 20px',
    },
    '& .MuiOutlinedInput-root input::placeholder': {
      fontSize: '14px',
    },
    '& .css-wufqwl-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
      // opacity: 0,
      color: '#263238 !important',
      '-webkit-text-fill-color': 'rgb(0 0 0 / 100%)',
    },
  },
  Mselect: {
    '& .css-y4ygc1-MuiInputBase-root-MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      // padding: "4px 4px 4px 8px",
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
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
        display: 'flex',
        alignItems: 'center',
        lineHeight: '120% !important',
        maxHeight: 'none !important',
        whiteSpace: 'unset !important',
        overflow: 'unset !important',
      },
      '& .MuiDataGrid-cell--textRight': {
        justifyContent: 'flex-end',
      },
      '& .MuiDataGrid-cell--textLeft': {
        justifyContent: 'flex-start',
      },
      '& .MuiDataGrid-cell:focus-within,& .MuiDataGrid-cell:focus,& .MuiDataGrid-columnHeader:focus-within,& .MuiDataGrid-columnHeader:focus':
        {
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
          display: 'flex',
          alignItems: 'center',
          lineHeight: '120% !important',
          maxHeight: 'none !important',
          whiteSpace: 'unset !important',
          overflow: 'unset !important',
        },
        '& .MuiDataGrid-cell--textRight': {
          justifyContent: 'flex-end',
        },
        '& .MuiDataGrid-cell--textLeft': {
          justifyContent: 'flex-start',
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
  MdataGridChangeColorRow: {
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
          display: 'flex',
          alignItems: 'center',
          lineHeight: '120% !important',
          maxHeight: 'none !important',
          whiteSpace: 'unset !important',
          overflow: 'unset !important',
        },
        '& .MuiDataGrid-cell--textRight': {
          justifyContent: 'flex-end',
        },
        '& .MuiDataGrid-cell--textLeft': {
          justifyContent: 'flex-start',
        },
      },
      '& .MuiDataGrid-row.Mui-selected': {
        backgroundColor: '#E7FFE9 !important',
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
      // paddingRight: '65px !important',
      height: '38px',
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
      'background-color': '#f1f1f1 !important',
      '-webkit-text-fill-color': 'rgb(0 0 0 / 100%)',
    },
  },
  MStepper: {
    '& .css-4q7q78-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
      color: '#DDDDDD',
    },
    '& .css-c9cih3-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
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
  MLabelBDStatus: {
    padding: '1px 20px 1px 20px',
    borderRadius: '8px',
    // width: "100px",
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  MTextEllipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  MTextFieldNumberPrint: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      fontSize: '14px',
      textAlignLast: 'end !important',
      width: '92px',
      height: '26px'
    },
    '& .css-wufqwl-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
      color: '#263238 !important',
      '-webkit-text-fill-color': 'rgb(0 0 0 / 100%)',
    },
  },
  MFormControlLabel: {
    '& .MuiFormControlLabel-label': {
      fontSize: 'small',
      margin: '10px 0px -10px 0px',
    },
  },
  MLabelTooltipWrapper: {
    position: 'relative',
    '& .title': {
      position: 'absolute',
      top: '110%',
      left: '0',
      color: 'red',
      width: '300px',
      display: 'none',
    },
    '&:hover .title': {
      display: 'block',
    },
  },
  MTextareaBD: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px !important',
    },
  },
  MtextFieldNumberNoneArrow: {
    '& .MuiInput-input': {
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
      },
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px !important',
      fontSize: '15px',
      fontWeight: 'bold',
      textAlignLast: 'end !important',
    },
    '& .css-wufqwl-MuiInputBase-input-MuiOutlinedInput-input.Mui-disabled': {
      color: '#263238 !important',
    },
  },
  MSearchBranch: {
    '& button': {
      transform: 'none !important',
    },
  },
  MSearchBranchInput: {
    '& .MuiOutlinedInput-input': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      paddingLeft: '12px',
    },
  },
  MWrapperListBranch: {
    border: '1px solid #C1C1C1',
    borderRadius: '10px',
    padding: '15px 13px',
    minHeight: '270px',
    '& .wrapper-item': {
      border: '1px solid #AEAEAE',
      boxSizing: 'border-box',
      borderRadius: '5px',
      background: '#EAEBEB',
      color: '#C1C1C1',
      marginRight: '10px',
      marginBottom: '10px',
      padding: '0px 9px',
      fontSize: '14px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        cursor: 'pointer',
        fontSize: '14px',
        marginLeft: '5px',
      },
    },
  },
});

export { useStyles };
