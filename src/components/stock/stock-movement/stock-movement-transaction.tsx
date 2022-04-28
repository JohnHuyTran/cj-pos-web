import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { ReactElement } from 'react';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import { useStyles } from '../../../styles/makeTheme';

interface Props {
  open: boolean;
  onClose: () => void;
  mockData: string;
}
function StockMovementTransaction({ open, onClose, mockData }: Props): ReactElement {
  const classes = useStyles();
  const columns: GridColDef[] = [
    {
      field: 'barcode',
      headerName: 'บาร์โค้ด',
      headerAlign: 'center',
      align: 'center',
      minWidth: 150,
      flex: 0.5,
      sortable: false,
    },
    {
      field: 'qty',
      headerName: 'จำนวน',
      minWidth: 150,
      // flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'unit',
      headerName: 'หน่วย',
      minWidth: 150,
      // flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'unitfactor',
      headerName: 'Unit Factor',
      minWidth: 150,
      // flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'acQty',
      headerName: 'จำนวนที่ทำรายการ(ชิ้น)',
      minWidth: 200,
      // flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
  ];

  const rows = [{ id: 1, barcode: '123456789', qty: '2', unit: 'ชิ้น', unitfactor: 1, acQty: 1 }];

  const handleClose = async () => {
    onClose();
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth="md"
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}></BootstrapDialogTitle>
      <DialogContent sx={{ padding: '1em' }}>
        <DialogContentText sx={{ textAlign: 'center', whiteSpace: 'pre-line', color: '#000000', pt: 3 }}>
          {/* StockMovementTransaction: {mockData} */}
          <div className={classes.MdataGridPaginationTop} style={{ width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableColumnMenu={true}
              hideFooterPagination={true}
              disableSelectionOnClick={true}
              hideFooter={true}
              autoHeight
            />
          </div>
        </DialogContentText>
      </DialogContent>
      {/* <DialogActions sx={{ justifyContent: 'center', margin: '10px 0px 20px 0px' }}> */}
      {/* <DialogActions>
        <Button
          id="btnClose"
          variant="contained"
          color="error"
          sx={{ borderRadius: '5px', width: '126px' }}
          onClick={onClose}
        >
          ปิด
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}

export default StockMovementTransaction;
