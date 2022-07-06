import React, { ReactElement } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import LoadingModal from '../../../commons/ui/loading-modal';
import { Box, Grid } from '@mui/material';
import DatePickerComponent from '../../../commons/ui/date-picker';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useStyles } from '../../../../styles/makeTheme';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // headerTitle: string;
  // status: number;
  // error?: boolean;
}
interface loadingModalState {
  open: boolean;
}

export default function ModelConfirm({
  open,
  // remark,
  // setRemark,
  // status,
  onClose,
  onConfirm,
}: // headerTitle,
// error,
Props): ReactElement {
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleConfirm = async () => {
    handleOpenLoading('open', true);
    await onConfirm();
    handleOpenLoading('open', false);
    onClose();
  };

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const columns: GridColDef[] = [
    {
      field: 'field1',
      headerName: 'ค่าน้ำแข็งหลอด',
      minWidth: 130,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'field2',
      headerName: 'ค่าน้ำดื่มชงกาแฟ',
      headerAlign: 'center',
      align: 'right',
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'field3',
      headerName: 'ค่าไข่ไก่',
      minWidth: 80,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },

    {
      field: 'field4',
      headerName: 'ค่านม',
      minWidth: 80,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'field5',
      headerName: 'ค่าจ้างรายวัน',
      minWidth: 115,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'field6',
      headerName: 'อื่นๆ',
      minWidth: 80,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'field7',
      headerName: 'รวม',
      minWidth: 80,
      headerAlign: 'center',
      align: 'right',
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const rows = [
    {
      id: 1,
      field1: '2,350.00',
      field2: '350.00',
      field3: '350.00',
      field4: '2,350.00',
      field5: '2,350.00',
      field6: '350.00',
      field7: '350.00',
    },
    {
      id: 2,
      field1: '2,350.00',
      field2: '350.00',
      field3: '2,350.00',
      field4: '2,350.00',
      field5: '2,350.00',
      field6: '350.00',
      field7: '350.00',
    },
  ];

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='lg'
        PaperProps={{ sx: { minWidth: 900 } }}>
        <DialogContent sx={{ mt: 3, mr: 3, ml: 3 }}>
          <DialogContentText id='alert-dialog-description' sx={{ color: '#263238' }}>
            <Typography variant='h5' align='center' sx={{ marginBottom: 1 }}>
              ยืนยันอนุมัติค่าใช้จ่าย
            </Typography>
            <Typography variant='subtitle1' component='div'>
              จำนวนสาขาที่อนุมัติ : 5 สาขา
            </Typography>
          </DialogContentText>

          <Grid container rowSpacing={1} columnSpacing={{ xs: 7 }} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography gutterBottom variant='subtitle1' component='div'>
                วันที่ค่าใช้จ่าย <span style={{ color: '#F54949' }}>*</span>
              </Typography>
              <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom variant='subtitle1' component='div'>
                วันที่อนุมัติเงินสำรอง <span style={{ color: '#F54949' }}>*</span>
              </Typography>
              <DatePickerComponent
                onClickDate={handleEndDatePicker}
                value={endDate}
                type={'TO'}
                minDateTo={startDate}
              />
            </Grid>
          </Grid>

          <div
            style={{ width: '100%', height: rows.length >= 8 ? '70vh' : 'auto', marginTop: 25 }}
            className={classes.MdataGridDetail}>
            <DataGrid
              rows={rows}
              columns={columns}
              // pageSize={pageSize}
              // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              // rowsPerPageOptions={[10, 20, 50, 100]}
              pagination
              disableColumnMenu
              autoHeight={rows.length >= 8 ? false : true}
              scrollbarSize={10}
              rowHeight={65}
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', m: 5, mr: 5, ml: 5 }}>
          <Button
            id='btnCancle'
            variant='contained'
            color='cancelColor'
            sx={{ borderRadius: 2, width: 120, mr: 4 }}
            onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            id='btnConfirm'
            variant='contained'
            color='primary'
            sx={{ borderRadius: 2, width: 120 }}
            onClick={handleConfirm}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}
