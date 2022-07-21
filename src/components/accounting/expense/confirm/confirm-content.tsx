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
  title: string;
  columnsList?: GridColDef[];
  rowList?: any[];
  handleDate: (period: any) => void;
}
interface State {
  startDate: any;
  endDate: any;
}

export default function confirmContent({
  startDate,
  endDate,
  title,
  columnsList,
  rowList,
  handleDate,
}: Props): ReactElement {
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

  const columns = columnsList ? columnsList : [];
  const rows = rowList ? rowList : [];

  return (
    <>
      <DialogContentText id='alert-dialog-description' sx={{ color: '#263238' }}>
        <Typography variant='h5' align='center' sx={{ marginBottom: 1 }}>
          ยืนยันอนุมัติค่าใช้จ่าย
        </Typography>
        <Typography variant='subtitle1' component='div'>
          จำนวนสาขาที่อนุมัติ : {title}
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
