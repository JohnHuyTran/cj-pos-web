import React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DesktopDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../styles/theme';
import moment from 'moment';
// import 'moment/locale/th';
// moment.locale('th');
const materialTheme = createTheme({
  palette: {
    primary: {
      main: theme.palette.primary.main,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#446EF2',
          fontSize: '10rem',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: '2px 12px 2px 12px',
        },
        input: {
          padding: '2px 12px 2px 12px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          padding: '2px 12px 2px 12px',
        },
        input: {
          padding: '2px 12px 2px 12px',
        },
      },
    },
  },
});

interface StateProps {
  onClickDate: any;
}

const DatePickerComponent: React.FC<StateProps> = (props) => {
  const [defaultDate, setDefaultDate] = React.useState<Date | null>(new Date());
  const [newDate, setNewDate] = React.useState<Date | null>(new Date());
  // var date_format = moment(value).format("MM/DD/YYYY HH:mm:ss");
  // const [inputValue, setInputValue] = React.useState(moment().format("DD/MM/YYYY"));

  const handleDateChange = (newValue: any) => {
    setDefaultDate(newValue);
    setNewDate(newValue);
    props.onClickDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <ThemeProvider theme={materialTheme}>
        <FormControl sx={{ width: 193 }}>
          <DatePicker
            disableHighlightToday={true}
            showDaysOutsideCurrentMonth={true}
            value={defaultDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
            inputFormat='DD/MM/YYYY'
          />
        </FormControl>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
