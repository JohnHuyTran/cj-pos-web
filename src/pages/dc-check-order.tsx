import Container from '@mui/material/Container';
import { Box } from "@mui/material";
import TitleHeader from '../components/title-header';
import DCCheckOrderSearch from '../components/dc-check-orders/dc-check-order';

const DCCheckOrder = () => {
  return (
    <Container maxWidth="xl">
      <TitleHeader title="ตรวจสอบผลต่างการรับสินค้า" icon="staroutlineoutline" />
      <Box mt={3}>
        <DCCheckOrderSearch />
      </Box>
    </Container>
  );
};

export default DCCheckOrder;