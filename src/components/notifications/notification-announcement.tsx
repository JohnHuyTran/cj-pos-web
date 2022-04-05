import { Card, TablePagination } from '@mui/material';
import React from 'react';

// interface Props {
//   userPermission: any[];
//   listData: any[];
//   onSearch: () => void;
// }

export default function NotificationAnnouncement() {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  return (
    <>
      <Card sx={{ height: '100%', border: '1px solid #E0E0E0', borderRadius: '10px' }}>
        <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={10}
          rowsPerPageOptions={[]}
        />
      </Card>
    </>
  );
}
