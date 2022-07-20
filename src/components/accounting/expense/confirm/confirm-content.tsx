import React, { ReactElement } from 'react';
import moment from 'moment';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import DatePickerComponent from '../../../commons/ui/date-picker';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useStyles } from '../../../../styles/makeTheme';

interface Props {
  startDate: string;
  endDate: string;
  handleDate: (period: any) => void;
}
interface State {
  startDate: any;
  endDate: any;
}

export default function confirmContent({ startDate, endDate, handleDate }: Props): ReactElement {
  const classes = useStyles();
  const [periodData, setPeriodData] = React.useState<State>({
    startDate: startDate,
    endDate: endDate,
  });

  const handleStartDatePicker = async (value: any) => {
    setPeriodData({ ...periodData, startDate: moment(value).startOf('day').toISOString() });
    await handleDate(periodData ? periodData : null);
  };
  const handleEndDatePicker = async (value: any) => {
    setPeriodData({ ...periodData, endDate: moment(value).startOf('day').toISOString() });
    await handleDate(periodData ? periodData : null);
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
    <>
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
          <DatePickerComponent
            onClickDate={handleStartDatePicker}
            value={periodData.startDate}
            type={'TO'}
            minDateTo={periodData.startDate}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom variant='subtitle1' component='div'>
            วันที่อนุมัติเงินสำรอง <span style={{ color: '#F54949' }}>*</span>
          </Typography>
          <DatePickerComponent
            onClickDate={handleEndDatePicker}
            value={periodData.endDate}
            type={'TO'}
            minDateTo={periodData.startDate}
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
    </>
  );
}