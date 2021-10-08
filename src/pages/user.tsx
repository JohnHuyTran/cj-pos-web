import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function User() {
  const [state, setState] = useState(null);

  useEffect(() => {
    axios
      .get(`http://54.255.171.154:30010/api/order/shipment/LD21093000710344`)
      .then((res) => {
        const persons: any = res.data;
        setState(persons);
      });
  }, []);

  return (
    <Container maxWidth='sm'>
      <Typography variant='h1'> User </Typography>
      {state && <div>A</div>}
      {console.log(state)}
    </Container>
  );
}
