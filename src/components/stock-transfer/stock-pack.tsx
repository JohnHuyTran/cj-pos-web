import React, { useMemo } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, useGridApiRef } from '@mui/x-data-grid';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import DatePickerComponent from '../commons/ui/date-picker-detail';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useStyles } from '../../styles/makeTheme';
import { numberWithCommas } from '../../utils/utils';
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    //flex: 0.5,
    width: 70,
    headerAlign: 'center',
    sortable: false,
    // hide: true,
    renderCell: (params) => (
      <Box component='div' sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'barcode',
    headerName: 'บาร์โค้ด',
    width: 300,
    flex: 0.7,
    headerAlign: 'center',
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: 'productName',
    headerName: 'รายละเอียดสินค้า',
    headerAlign: 'center',
    width: 220,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant='body2'>{params.value}</Typography>
        <Typography color='textSecondary' sx={{ fontSize: 12 }}>
          {params.getValue(params.id, 'skuCode') || ''}
        </Typography>
      </div>
    ),
  },
  {
    field: 'stockQty',
    headerName: 'สต๊อกสินค้าคงเหลือ',
    width: 150,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => numberWithCommas(params.value),
  },
  {
    field: 'approveQty',
    headerName: 'จำนวนที่อนุมัติ',
    width: 150,
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    renderCell: (params) => numberWithCommas(params.value),
  },
  {
    field: 'unitName',
    headerName: 'หน่วย',
    width: 110,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'actualQty',
    headerName: 'จำนวนโอนจริง',
    width: 150,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          variant='outlined'
          name='txnQtyReturn'
          type='number'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            var qty: any =
              params.getValue(params.id, 'approveQty') &&
              params.getValue(params.id, 'approveQty') !== null &&
              params.getValue(params.id, 'approveQty') != undefined
                ? params.getValue(params.id, 'approveQty')
                : 0;
            var value = e.target.value ? parseInt(e.target.value, 10) : '0';
            var returnQty = Number(params.getValue(params.id, 'actualQty'));
            if (returnQty === 0) value = chkReturnQty(value);
            if (value < 0) value = 0;
            if (value > qty) value = qty;
            params.api.updateRows([{ ...params.row, returnQty: value }]);
          }}
          disabled={params.getValue(params.id, 'isDraftStatus') ? true : false}
          autoComplete='off'
        />
      </div>
    ),
  },
  {
    field: 'unitFactor',
    headerName: 'หน่วยย่อย',
    width: 150,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          variant='outlined'
          name='txnQtyReturn'
          type='number'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            var qty: any =
              params.getValue(params.id, 'actualQty') &&
              params.getValue(params.id, 'actualQty') !== null &&
              params.getValue(params.id, 'actualQty') != undefined
                ? params.getValue(params.id, 'actualQty')
                : 0;
            var value = e.target.value ? parseInt(e.target.value, 10) : '0';
            var returnQty = Number(params.getValue(params.id, 'returnQty'));
            if (returnQty === 0) value = chkReturnQty(value);
            if (value < 0) value = 0;
            if (value > qty) value = qty;
            params.api.updateRows([{ ...params.row, returnQty: value }]);
          }}
          disabled={params.getValue(params.id, 'isDraftStatus') ? true : false}
          autoComplete='off'
        />
      </div>
    ),
  },
  {
    field: 'tote',
    headerName: 'เลข Tote/ลัง',
    width: 150,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <TextField
          variant='outlined'
          name='txnQtyReturn'
          type='number'
          inputProps={{ style: { textAlign: 'right' } }}
          value={params.value}
          onChange={(e) => {
            var qty: any =
              params.getValue(params.id, 'actualQty') &&
              params.getValue(params.id, 'actualQty') !== null &&
              params.getValue(params.id, 'actualQty') != undefined
                ? params.getValue(params.id, 'actualQty')
                : 0;
            var value = e.target.value ? parseInt(e.target.value, 10) : '0';
            var returnQty = Number(params.getValue(params.id, 'returnQty'));
            if (returnQty === 0) value = chkReturnQty(value);
            if (value < 0) value = 0;
            if (value > qty) value = qty;
            params.api.updateRows([{ ...params.row, returnQty: value }]);
          }}
          disabled={params.getValue(params.id, 'isDraftStatus') ? true : false}
          autoComplete='off'
        />
      </div>
    ),
  },
];

function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: '',
        width: 0,
        sortable: false,
        renderCell: (params) => {
          apiRef.current = params.api;
          return null;
        },
      }),
    [columns]
  );

  return { apiRef, columns: _columns };
}

const chkReturnQty = (value: any) => {
  let v = String(value);
  if (v.substring(1) === '0') return Number(v.substring(0, 1));
  return value;
};
function StockPackChecked({ isOpen, onClickClose }: Props) {
  const classes = useStyles();
  const [cols, setCols] = React.useState(columns);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [open, setOpen] = React.useState(isOpen);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [sourceBranch, setSourceBranch] = React.useState('');
  const [destinationBranch, setDestinationBranch] = React.useState('');
  const [btNo, setBtNo] = React.useState('');
  const [btStatus, setBtStatus] = React.useState<String>('');
  const [reasons, setReasons] = React.useState('');

  const [comment, setComment] = React.useState('');
  const [characterCount, setCharacterCount] = React.useState(0);
  const maxCommentLength = 255;
  const handleChangeComment = (event: any) => {
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= maxCommentLength) {
      setCharacterCount(event.target.value.length);
      setComment(value);
    }
  };

  let rows;

  React.useEffect(() => {
    setSourceBranch('1123-ท่าช่าง');
    setDestinationBranch('1124-พรหมบุรี');
    setBtNo('AB123');
    setReasons('ทั้งหมด');
    setBtStatus('0');
  }, [open]);
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  const handleSaveBtn = () => {};

  const handleConfirmBtn = () => {};

  const currentlySelected = () => {};

  return (
    <React.Fragment>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClickClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>สร้างรายการโอนสินค้า</Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร BT</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{btNo}</Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่สร้างรายการ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{'create date'}</Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่โอนสินค้า* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
              </Grid>
              <Grid item lg={1}></Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่สิ้นสุด* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <DatePickerComponent
                  onClickDate={handleEndDatePicker}
                  value={endDate}
                  type={'TO'}
                  minDateTo={startDate}
                />
              </Grid>
              <Grid item lg={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'> สาขาต้นทาง* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <TextField value={sourceBranch} disabled fullWidth></TextField>
              </Grid>
              <Grid item lg={1}></Grid>
              <Grid item lg={2}>
                <Typography variant='body2'>สาขาปลายทาง* :</Typography>
              </Grid>
              <Grid item lg={3}>
                <TextField value={destinationBranch} disabled fullWidth></TextField>
              </Grid>
              <Grid item lg={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item lg={2}>
                <Typography variant='body2'> สาเหตุการโอน :</Typography>
              </Grid>
              <Grid item lg={3}>
                <TextField value={reasons} disabled fullWidth></TextField>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
          </Box>
          <Grid
            item
            container
            xs={12}
            sx={{ mt: 3 }}
            justifyContent='space-between'
            direction='row'
            alignItems='flex-end'>
            <Grid item xl={2}></Grid>
            <Grid item>
              <Button
                id='btnSave'
                variant='contained'
                color='warning'
                className={classes.MbtnSave}
                onClick={handleSaveBtn}
                startIcon={<SaveIcon />}
                sx={{ width: 200 }}>
                บันทึก
              </Button>

              <Button
                id='btnApprove'
                variant='contained'
                color='primary'
                className={classes.MbtnApprove}
                onClick={handleConfirmBtn}
                startIcon={<CheckCircleOutline />}
                sx={{ width: 200 }}>
                ส่งงานให้ DC
              </Button>
            </Grid>
          </Grid>
          <Box mt={2} bgcolor='background.paper'>
            <div
              // style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto' }}
              style={{ width: '100%', height: 'auto' }}
              className={classes.MdataGridDetail}>
              <DataGrid
                rows={[]}
                columns={cols}
                // checkboxSelection={pnStatus === 0 ? true : false}
                disableSelectionOnClick
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                disableColumnMenu
                // autoHeight={rows.length >= 8 ? false : true}
                autoHeight={true}
                scrollbarSize={10}
                rowHeight={65}
                onCellClick={currentlySelected}
                onCellFocusOut={currentlySelected}
              />
            </div>
          </Box>
          <Box mt={3}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={4}>
                <Typography variant='body2'>หมายเหตุ:</Typography>
                <TextField
                  multiline
                  fullWidth
                  rows={5}
                  onChange={handleChangeComment}
                  defaultValue={comment}
                  placeholder='ความยาวไม่เกิน 255 ตัวอักษร'
                  className={classes.MtextFieldRemark}
                  inputProps={{ maxLength: maxCommentLength }}
                  sx={{ maxWidth: 350 }}
                  disabled={btStatus !== '0'}
                />

                <div
                  style={{
                    fontSize: '11px',
                    color: '#AEAEAE',
                    width: '100%',
                    maxWidth: 350,
                    textAlign: 'right',
                    // marginTop: "-1.5em",
                  }}>
                  {characterCount}/{maxCommentLength}
                </div>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default StockPackChecked;
