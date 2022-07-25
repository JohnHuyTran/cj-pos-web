import { useState } from 'react';
import {
  Box,
  Container } from '@mui/material';
import TitleHeader from 'components/title-header';
import { useTranslation } from 'react-i18next';

// Components
import SearchReserves from 'components/setting/reserves/search-reserves';
import ReservesDetailTable from 'components/setting/reserves/reserves-detail-table';



export default function reserves() {
  const { t } = useTranslation(['reserves', 'common']);
  const [isSearch, setIsSearch] = useState(false)

  return (
    <div>
      <Container>
        <TitleHeader title={t('documentSearch')} />

        <Box mt={3}>
          <SearchReserves onClickSearch={(value) => setIsSearch(value)} />
        </Box>
        { isSearch && (
          <Box mt={3}>
            <ReservesDetailTable />
          </Box>
        )}
      </Container>
    </div>
  )
}