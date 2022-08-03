import React, { useState } from 'react';
import moment from 'moment';
import { DataGrid, GridCellParams, GridColDef, GridRowData } from '@mui/x-data-grid';

import { useAppDispatch, useAppSelector } from '../../../store/store';

//css
import { useStyles } from '../../../styles/makeTheme';
import { Box } from '@mui/material';
import { OpenEndSearchInfo } from '../../../models/branch-accounting-model';

function OpenEndList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const payloadOpenEndSearch = useAppSelector((state) => state.searchOpenEndSlice.payloadOpenEndSearch);
  const items = useAppSelector((state) => state.searchOpenEndSlice.openEndSearchList);
  const cuurentPage = useAppSelector((state) => state.searchOpenEndSlice.openEndSearchList.page);
  const limit = useAppSelector((state) => state.searchOpenEndSlice.openEndSearchList.perPage);
  const [pageSize, setPageSize] = useState(limit.toString());
  const [openLoadingModal, setOpenLoadingModal] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      width: 80,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
  ];

  let rows: any = items.data.map((item: OpenEndSearchInfo, indexs: number) => {
    return {
      id: indexs,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
    };
  });

  return (
    <div>
      <div>test</div>
    </div>
    //     <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
    //         <DataGrid
    //     rows={rows}
    //     columns={columns}
    //     disableColumnMenu
    //     autoHeight={rows.length >= 10 ? false : true}
    //     scrollbarSize={10}
    //     pagination
    //     page={cuurentPage - 1}
    //     pageSize={pageSize}
    //     rowsPerPageOptions={[10, 20, 50, 100]}
    //     rowCount={items.total}
    //     paginationMode='server'
    //     onPageChange={handlePageChange}
    //     onPageSizeChange={handlePageSizeChange}
    //     onCellClick={currentlySelected}
    //     loading={loading}
    //     rowHeight={65}
    //   />
    //     </div>
  );
}

export default OpenEndList;
