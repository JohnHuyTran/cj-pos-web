import React, { ReactElement } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

interface Props {}

export default function ProductList({}: Props): ReactElement {
  return (
    <div>
      <Container maxWidth='sm'>
        <Typography variant='h1'> Product List </Typography>
      </Container>
    </div>
  );
}
