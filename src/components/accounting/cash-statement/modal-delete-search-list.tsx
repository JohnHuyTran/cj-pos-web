import React, { Fragment, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';

//css
import { useStyles } from '../../../styles/makeTheme';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Props {
  open: boolean;
  onClose: () => void;
  payloadDelete?: any;
}

function ModalDeleteSearchList({ open, onClose, payloadDelete }: Props) {
  const classes = useStyles();
  console.log('payloadDelete: ', payloadDelete);

  const columns: GridColDef[] = [
    {
      field: 'id',

      headerName: 'ลำดับ',
      width: 120,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'cashShort',

      headerName: 'test',
      width: 120,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'cashShort',

      headerName: 'test',
      width: 120,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
  ];
  console.log('payloadDelete: ', payloadDelete);
  let rows: any = Object.values(payloadDelete).map((item: any, index: number) => {
    console.log('item:', item);
    return {
      id: index,
      branch: item.branch,
      date1: item.date1,
      date2: item.date2,
      cashShort: item.cash1,
      cashOver: item.cash2,
    };
  });

  console.log('rows: ', rows);

  return (
    <Fragment>
      <Dialog open={open} maxWidth="sm" fullWidth={true}>
        <DialogContent>
          <Typography variant="h6" align="center" sx={{ marginBottom: 1 }}>
            ยืนยันการลบรายการ
          </Typography>

          <Box>
            <div
              style={{ width: '100%', height: rows.length >= 5 ? '43vh' : 'auto' }}
              className={classes.MdataGridPaginationTop}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                hideFooter
                scrollbarSize={10}
                // autoHeight={notPrintRows.length < 5}
                rowHeight={70}
              />
            </div>
          </Box>

          <DialogActions sx={{ justifyContent: 'center', mt: 5 }}>
            <Button
              id="btnCancle"
              variant="contained"
              color="cancelColor"
              className={classes.MbtnSearch}
              onClick={onClose}
              sx={{ mr: 3, width: '20%' }}
            >
              ยกเลิก
            </Button>
            <Button
              id="btnDelete"
              variant="contained"
              color="error"
              className={classes.MbtnSearch}
              sx={{ width: '20%' }}
            >
              ลบรายการ
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default ModalDeleteSearchList;
