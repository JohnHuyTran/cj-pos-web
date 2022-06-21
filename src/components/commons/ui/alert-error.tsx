import React, { ReactElement } from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import theme from '../../../styles/theme';
import { ErrorOutline } from '@mui/icons-material';
import { ErrorDetailResponse } from '../../../models/api-error-model';
import { numberWithCommas, stringNullOrEmpty } from '../../../utils/utils';
import { GridColDef } from '@mui/x-data-grid';

interface Props {
  open: boolean;
  onClose: () => void;
  textError: string;
  errorCode?: string;
  payload?: ErrorDetailResponse;
  title?: string;
}

export default function AlertError({ open, onClose, textError, errorCode, payload, title }: Props): ReactElement {
  const classes = useStyles();
  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      minWidth: 60,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'barCode',
      headerName: 'บาร์โค้ด',
      minWidth: 122,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
    },
    {
      field: 'productDetail',
      headerName: 'รายละเอียดสินค้า',
      minWidth: 250,
      headerAlign: 'center',
      disableColumnMenu: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Typography variant='body2'>{params.value}</Typography>
            <Typography color='textSecondary' sx={{ fontSize: 12 }}>
              {params.row.skuCode || ''}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'stockQty',
      headerName: 'จำนวน',
      headerAlign: 'right',
      flex: 1.2,
      sortable: false,
      align: 'right',
      renderCell: (params) => {
        return (
          <Typography variant='body2' sx={{ color: 'red', marginRight: '10px' }}>
            <b>
              {numberWithCommas(params.value)} {params.row.baseUnitName}
            </b>
          </Typography>
        );
      },
    },
    ,
  ];

  return (
    <Dialog
      open={open}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      fullWidth={true}
      maxWidth='sm'>
      <DialogTitle data-testid='txtContent' sx={{ textAlign: 'center', whiteSpace: 'pre-wrap', color: '#000000' }}>
        <Box>
          <ErrorOutline sx={{ color: '#F54949', fontSize: '4em' }} />
          {textError}
        </Box>
        {!stringNullOrEmpty(title) && <Box>{title}</Box>}
        <Box></Box>
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: '0', marginBottom: '30px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }} className={classes.MdataGridPaginationTop}>
            <DataGrid rows={rows} columns={columns} hideFooter autoHeight rowHeight={70} />
          </div>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', margin: '10px 0px 20px 0px' }}>
        <Button
          data-testid='btnClose'
          id='btnClose'
          variant='contained'
          color='error'
          sx={{ borderRadius: '5px', width: '126px' }}
          onClick={onClose}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}
