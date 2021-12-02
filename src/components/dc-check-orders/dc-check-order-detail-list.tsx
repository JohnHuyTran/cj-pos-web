import React, { ReactElement } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowData, GridValueGetterParams } from '@mui/x-data-grid';
import { Entry, ShipmentInfo } from '../../models/order-model';
import { useAppSelector } from '../../store/store';
import { CheckOrderDetailInfo, CheckOrderDetailItims } from '../../models/dc-check-order-model';

import { useStyles } from '../../styles/makeTheme';

interface Props {
  //   sdNo: string;
  items: [];
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 90,
    sortable: false,
  },
  {
    field: 'productId',
    headerName: 'รหัสสินค้า',
    flex: 0.5,
    sortable: false,
    headerAlign: 'center',
  },
  {
    field: 'productBarCode',
    headerName: 'บาร์โค้ด',
    flex: 0.5,
    sortable: false,
    headerAlign: 'center',
  },
  {
    field: 'productDescription',
    headerName: 'รายละเอียดสินค้า',
    minWidth: 260,
    sortable: false,
    headerAlign: 'center',
  },
  {
    field: 'productUnit',
    headerName: 'หน่วย',
    minWidth: 80,
    sortable: false,
    headerAlign: 'center',
  },
  {
    field: 'productQuantityRef',
    headerName: 'จำนวนอ้างอิง',
    width: 135,
    sortable: false,
    align: 'right',
    headerAlign: 'center',
  },
  {
    field: 'productQuantityActual',
    headerName: 'จำนวนรับจริง',
    width: 135,
    sortable: false,
    align: 'right',
    headerAlign: 'center',
  },
  {
    field: 'productDifference',
    headerName: 'จำนวนส่วนต่าง',
    width: 140,
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
];

var calProductDiff = function (params: GridValueGetterParams) {
  let diff =
    Number(params.getValue(params.id, 'productQuantityActual')) -
    Number(params.getValue(params.id, 'productQuantityRef'));

  if (diff > 0) return <label style={{ color: '#446EF2', fontWeight: 700 }}> +{diff} </label>;
  if (diff < 0) return <label style={{ color: '#F54949', fontWeight: 700 }}> {diff} </label>;
  return diff;
};

export default function DCOrderEntries({ items }: Props): ReactElement {
  const classes = useStyles();
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
    };
  });

  const [pageSize, setPageSize] = React.useState<number>(10);

  return (
    <Box mt={2} bgcolor="background.paper">
      <div className={classes.MdataGridPaginationTop} style={{ width: '100%', marginBottom: '1em' }}>
        <DataGrid
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          rows={rows}
          columns={columns}
          autoHeight
        />
      </div>
    </Box>
  );
}
