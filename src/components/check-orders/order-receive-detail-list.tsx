import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { DataGrid, GridColDef, GridCellParams, GridRowId } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Entries, OrderReceiveDetailInfo, OrderReceiveDetailResponse } from '../../models/dc-check-order-model';
import { useStyles } from '../../styles/makeTheme';

export interface DataGridProps {
  entries: Array<Entries>;
}

export default function OrderReceiveDetailList(entries: any) {
  const classes = useStyles();
  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      minWidth: 75,
      //   flex: 0.65,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      minWidth: 140,
      flex: 1,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'productName',
      headerName: 'รายละเอียดสินค้า',
      minWidth: 160,
      flex: 1.3,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'unitName',
      headerName: 'หน่วย',
      minWidth: 130,
      //   flex: 0.9,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'qty',
      headerName: 'จำนวนอ้างอิง',
      minWidth: 130,
      // flex: 0.5,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
  ];

  const [pageSize, setPageSize] = React.useState<number>(10);

  const rows = entries.entries.map((data: Entries, indexs: number) => {
    return {
      id: `${data.barcode}_${indexs + 1}`,
      index: indexs + 1,
      barcode: data.barcode,
      productName: data.productName,
      unitName: data.unitName,
      qty: data.qty,
    };
  });

  return (
    <Box mt={4} bgcolor="background.paper">
      <div
        className={classes.MdataGridDetail}
        style={{ width: '100%', marginBottom: '1em', height: rows.length >= 8 ? '70vh' : 'auto' }}
      >
        <DataGrid
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          rows={rows}
          columns={columns}
          disableColumnMenu
          autoHeight={rows.length >= 8 ? false : true}
          scrollbarSize={10}
        />
      </div>
    </Box>
  );
}
