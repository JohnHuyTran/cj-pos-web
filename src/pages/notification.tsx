import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ReadFile from '../components/check-orders/read-file';
export default function Notification() {
  return (
    <Container maxWidth='sm'>
      <Typography variant='h1'> Notification </Typography>
      <ReadFile />
    </Container>
  );
}
