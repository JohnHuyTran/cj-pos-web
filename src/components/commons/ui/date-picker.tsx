// @ts-nocheck
import React from 'react'
import moment from "moment";
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DesktopDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../styles/theme';

const materialTheme = createTheme({
    palette: {
        primary: {
            main: theme.palette.primary.main,
        },
    }
});

export default function DatePickerComponent(props) {
    const [defaultDate, setDefaultDate] = React.useState<Date | null>(new Date());
    const [newDate, setNewDate] = React.useState<Date | null>(new Date());
    // var date_format = moment(value).format("MM/DD/YYYY HH:mm:ss");
    // const [inputValue, setInputValue] = React.useState(moment().format("DD/MM/YYYY"));



    const handleDateChange = (newValue: Date) => {
        setDefaultDate(newValue);
        setNewDate(newValue)
        props.onClickDate(newValue);
    }

    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <ThemeProvider theme={materialTheme}>
                <DatePicker
                    disableHighlightToday={true}
                    showDaysOutsideCurrentMonth={true}
                    value={defaultDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    inputFormat="DD/MM/YYYY"
                />
            </ThemeProvider>
        </LocalizationProvider>
    )
}
