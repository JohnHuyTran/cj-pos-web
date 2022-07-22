import TitleHeader from '../../components/title-header';
import { useTranslation } from 'react-i18next';

// Components
import SearchReserves from '../../components/setting/reserves/search-reserves';
import ReservesDetailTable from '../../components/setting/reserves/reserves-detail-table';

import {
  Box,
  Container } from '@mui/material';

export default function reserves() {
  const { t } = useTranslation(['reserves', 'common']);

  return (
    <div>
      <Container>
        <TitleHeader title={t('documentSearch')} />

        <Box mt={3}>
          <SearchReserves />
        </Box>
        <Box mt={3}>
          <ReservesDetailTable />
        </Box>
      </Container>
    </div>
  )
}