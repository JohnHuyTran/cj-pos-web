import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  Mdatepicker: {
    '& .MuiOutlinedInput-input': {
      // padding: "6px 0px !important",
      padding: '0px !important',
      fontFamily: 'Kanit',
    },
    '& .MuiIconButton-root': {
      color: '#CBD4DB !important',
      // padding: "5px !important",
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: '0px !important',
    },
    '& .MuiOutlinedInput-adornedStart': {
      paddingLeft: '0px !important',
    },
  },
  MdatepickerV2: {
    '& .MuiOutlinedInput-input': {
      // padding: "6px 0px !important",
      fontFamily: 'Kanit',
    },
    '& .MuiIconButton-root': {
      color: '#CBD4DB !important',
      // padding: "5px !important",
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: '0px !important',
    },
    '& .MuiOutlinedInput-adornedStart': {
      paddingLeft: '0px !important',
    },
  },
  MdatepickerDetail: {
    '& .MuiOutlinedInput-input': {
      padding: '0px !important',
      fontFamily: 'Kanit',
    },
    '& .MuiIconButton-root': {},
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: '0px !important',
    },
    '& .MuiOutlinedInput-adornedStart': {
      paddingLeft: '0px !important',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
  },
  MdatepickerError: {
    '& .MuiOutlinedInput-input': {
      // padding: "6px 0px !important",
      fontFamily: 'Kanit',
    },
    '& .MuiIconButton-root': {
      color: '#CBD4DB !important',
      // padding: "5px !important",
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: '0px !important',
    },
    '& .MuiOutlinedInput-adornedStart': {
      paddingLeft: '0px !important',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red !important',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'red !important',
    },
  },

  // MkeyboardDatePicker: {
  //   "& .MuiPickersDay-dayS": {
  //     backgroundColor: "#36C690",
  //   },
  // },
});

export { useStyles };
