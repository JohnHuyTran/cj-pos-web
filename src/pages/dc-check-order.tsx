import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Box } from "@mui/material";
import TitleHeader from '../components/title-header';
const DCCheckOrder = () => {
  return (
    <Container maxWidth="xl">
      <TitleHeader title="ตรวจสอบผลต่างการรับสินค้า" icon="staroutlineoutline" />
      <Box mt={3}>
        <Typography variant='h1'>ตรวจสอบผลต่างการรับสินค้า</Typography>
      </Box>
    </Container>
  );
};

export default DCCheckOrder;