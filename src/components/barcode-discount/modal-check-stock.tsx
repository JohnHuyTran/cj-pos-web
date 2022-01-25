import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useStyles } from '../../styles/makeTheme';
import { ErrorOutline } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/store';

interface Props {
  open: boolean;
  onClose: () => void;
}
const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ลำดับ',
    headerAlign: 'left',
    sortable: false,
    flex: 0.8,
  },
  {
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    headerAlign: 'left',
    flex: 1.2,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'left',
    flex: 1.8,
    sortable: false,
    renderCell: (params) => {
      console.log(params.row);

      return (
        <div>
          <Typography variant="body2">{params.value}</Typography>
          <Typography color="textSecondary" sx={{ fontSize: 12 }}>
            {params.row.skuCode || ''}
          </Typography>
        </div>
      );
    },
  },
  {
    field: 'stockRemain',
    headerName: 'จำนวนสต๊อก',
    headerAlign: 'right',
    flex: 1.2,
    sortable: false,
    align: 'right',
    renderCell: (params) => {
      return (
        <Typography variant="body2" sx={{ color: 'red', marginRight: '10px' }}>
          <b>{params.value}</b>
        </Typography>
      );
    },
  },
];

export default function ModalCheckStock({ open, onClose }: Props) {
  const classes = useStyles();
  const checkStocks = useAppSelector((state) => state.barcodeDiscount.checkStock);
  console.log({ checkStocks });

  let rows: any = [];
  rows = checkStocks.map((item: any, index: number) => {
    return {
      id: index + 1,
      barcode: item.barcode,
      productName: item.productName,
      stockRemain: item.stockRemain,
      skuCode: item.skuCode,
    };
  });
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
          <ErrorOutline sx={{ color: '#F54949', fontSize: '4em' }} />
          <br />
          {'จำนวนที่ขอลดเกินจำนวนสินค้าในสต๊อก'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className={classes.MdataGridPaginationTop}>
              <DataGrid rows={rows} columns={columns} hideFooter autoHeight />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" color="error" onClick={handleClose} sx={{ borderRadius: '5px' }}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
