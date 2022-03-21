import React, { ReactElement } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellParams, GridColDef, GridRowData, GridValueGetterParams } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { CheckOrderDetailItims } from '../../models/dc-check-order-model';

import { useStyles } from '../../styles/makeTheme';
import Typography from '@mui/material/Typography';
import { featchorderDetailDCAsync, setReloadScreen } from '../../store/slices/dc-check-order-detail-slice';

interface Props {
  items: [];
  clearCommment: () => void;
  isTote: boolean;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 70,
    sortable: false,
    renderCell: (params) => (
      <Box component='div' sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'productBarCode',
    headerName: 'บาร์โค้ด',
    minWidth: 130,
    // flex: 0.5,
    sortable: false,
    headerAlign: 'center',
  },
  {
    field: 'productDescription',
    headerName: 'รายละเอียดสินค้า',
    minWidth: 160,
    flex: 1,
    sortable: false,
    headerAlign: 'center',
    renderCell: (params) => (
      <div>
        <Typography variant='body2'>{params.value}</Typography>
        <Typography color='textSecondary' sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'productId') || ''}
        </Typography>
      </div>
    ),
  },
  {
    field: 'productUnit',
    headerName: 'หน่วย',
    minWidth: 50,
    sortable: false,
    headerAlign: 'center',
  },
  {
    field: 'productQuantityRef',
    headerName: 'จำนวนอ้างอิง',
    width: 115,
    sortable: false,
    align: 'right',
    headerAlign: 'center',
  },
  {
    field: 'productQuantityActual',
    headerName: 'จำนวนรับจริง',
    width: 115,
    sortable: false,
    align: 'right',
    headerAlign: 'center',
  },
  {
    field: 'productDifference',
    headerName: 'จำนวนส่วนต่าง',
    width: 120,
    sortable: false,
    align: 'right',
    headerAlign: 'center',
    renderCell: (params) => calProductDiff(params),
  },
  {
    field: 'productComment',
    headerName: 'หมายเหตุ',
    flex: 0.5,
    sortable: false,
    headerAlign: 'center',
  },
  {
    field: 'sdNo',
    headerName: 'รับสินค้าใน Tote',
    flex: 0.5,
    sortable: false,
    headerAlign: 'center',
    renderCell: (params) => {
      return (
        <Typography
          color='secondary'
          variant='body2'
          sx={{ textDecoration: 'underline' }}
          // onClick={() => handleOpenReturnModal(params.row.piNo, 'button')}>
        >
          {params.value}
        </Typography>
      );
    },
  },
];

var calProductDiff = function (params: GridValueGetterParams) {
  let diff =
    Number(params.getValue(params.id, 'productQuantityActual')) -
    Number(params.getValue(params.id, 'productQuantityRef'));

  if (diff > 0) return <label style={{ color: '#446EF2', fontWeight: 700 }}> +{diff} </label>;
  if (diff < 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> {diff} </label>;
  return diff;
};

export default function DCOrderEntries({ items, clearCommment, isTote }: Props): ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const rows = items.map((item: CheckOrderDetailItims, index: number) => {
    return {
      id: `${item.barcode}-${index + 1}`,
      index: index + 1,
      productId: item.skuCode,
      productBarCode: item.barcode,
      productDescription: item.productName,
      productUnit: item.unitName,
      productQuantityRef: item.qty,
      productQuantityActual: item.actualQty,
      productDifference: item.qtyDiff,
      productComment: item.comment,
      sdNo: item.sdNo ? item.sdNo : '',
      sdID: item.sdID ? item.sdID : '',
      isTote: item.isTote ? item.isTote : false,
    };
  });

  const [pageSize, setPageSize] = React.useState<number>(10);

  const currentlySelected = async (params: GridCellParams) => {
    const fieldName = params.colDef.field;
    const sdId: any = params.getValue(params.id, 'sdID');
    const sdNo = params.getValue(params.id, 'sdNo');
    if (fieldName === 'sdNo' && sdId) {
      try {
        await dispatch(featchorderDetailDCAsync(sdId));
        await dispatch(setReloadScreen(true));
        clearCommment();
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (isTote) {
    columns[8]['hide'] = false;
  } else {
    columns[8]['hide'] = true;
  }

  return (
    <Box mt={2} bgcolor='background.paper'>
      <div
        className={classes.MdataGridDetail}
        style={{ width: '100%', marginBottom: '1em', height: rows.length >= 8 ? '70vh' : 'auto' }}>
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
          onCellClick={currentlySelected}
        />
      </div>
    </Box>
  );
}
