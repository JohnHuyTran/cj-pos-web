import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import React, { useEffect } from 'react';
import DatePickerComponent from '../components/commons/ui/date-picker'
import moment from "moment";

export default function Notification() {

  const [dateValue, setDateValue] = React.useState<Date | null>(new Date());

  const handleDatePicker = (value: Date) => {
    setDateValue(value);
    var date_format = moment(value).format("MM/DD/YYYY HH:mm:ss");
    console.log(date_format);
  }
  console.log("dateValue: ", moment(dateValue).format("MM/DD/YYYY HH:mm:ss"));

  useEffect(() => {
    const handleEndConcert = () => {
      console.log('Stop this');
      // <-- access current ref value
    }

    console.log("use effect called");

    window.addEventListener('beforeunload', handleEndConcert);

    return () => {
      // hit endpoint to end show
      window.removeEventListener('beforeunload', handleEndConcert);
    }
  }, []);

  return (
    <Container maxWidth='sm'>
      <Typography variant='h1'> Notification </Typography>
      <DatePickerComponent onClickDate={handleDatePicker} />
    </Container>
  );
}
