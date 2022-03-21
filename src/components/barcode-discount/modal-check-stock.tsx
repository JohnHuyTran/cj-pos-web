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
    headerAlign: 'right',
    align: 'right',
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
    headerName: 'จำนวนสต๊อค',
    headerAlign: 'right',
    flex: 1.2,
    sortable: false,
    align: 'right',
    renderCell: (params) => {
      return (
        <Typography variant="body2" sx={{ color: 'red', marginRight: '10px' }}>
          <b>{params.value}{' '}{params.row.unitName}</b>
        </Typography>
      );
    },
  },
];

export default function ModalCheckStock({ open, onClose }: Props) {
  const classes = useStyles();
  const checkStocks = useAppSelector((state) => state.barcodeDiscount.checkStock);
  let rows: any = [];
  if (checkStocks && checkStocks.length > 0) {
    rows = checkStocks.map((item: any, index: number) => {
      return {
        id: index + 1,
        barcode: item.barcode,
        productName: item.productName,
        stockRemain: item.stockRemain,
        skuCode: item.skuCode,
        unitName: item.unitName
      };
    });
  }
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center', paddingTop: '30px', paddingBottom: '0' }}>
          <ErrorOutline sx={{ color: '#F54949', fontSize: '3em' }} />
          <br />
          <Typography sx={{ color: 'red', fontSize: '18px', marginBottom: '8px' }}>
            จำนวนที่ขอลดเกินจำนวนสินค้าในสต๊อก
          </Typography>
          <Typography sx={{ fontSize: '18px', color: '#000000', marginBottom: '8px' }}>รายการสินค้าในสต๊อก</Typography>
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: '0', marginBottom: '30px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%' }} className={classes.MdataGridPaginationTop}>
              <DataGrid rows={rows} columns={columns} hideFooter autoHeight rowHeight={70} />
            </div>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: '30px' }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{ borderRadius: '5px', mb: 1, height: '40px', width: '126.14px' }}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
