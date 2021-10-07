import moment from 'moment';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/store';
import {
  featchOrderListAsync,
  clearDataFilter,
} from '../../store/slices/check-order-slice';
import { CheckOrderRequest } from '../../models/order';
import OrderList from './order-list';
import { useStyles } from './order-css';
import DatePickerComponent from '../commons/ui/date-picker';

moment.locale('en');
interface State {
  orderShipment: string;
  orderNo: string;
  orderStatus: string;
  orderType: string;
}

function CheckOrderSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.checkOrderList);
  const [values, setValues] = React.useState<State>({
    orderShipment: '',
    orderNo: '',
    orderStatus: '',
    orderType: '',
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    console.log(values);
  };

  const onClickSearchBtn = () => {
    const payload: CheckOrderRequest = {
      shipmentNo: values.orderShipment,
      sdNo: values.orderNo,
      sdStatus: parseInt(values.orderStatus),
      sdType: parseInt(values.orderType),
    };
    dispatch(featchOrderListAsync(payload));
  };

  useEffect(() => {
    dispatch(clearDataFilter());
  }, []);

  const handleStartDatePicker = (value: Date) => {
    setStartDate(value);
    var date_format = moment(value).format('MM/DD/YYYY HH:mm:ss');
    console.log('start date: ', date_format);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
    var date_format = moment(value).format('MM/DD/YYYY HH:mm:ss');
    console.log('end date: ', date_format);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              เลขที่เอกสาร LD
            </Typography>
            <TextField
              size='small'
              name='orderShipment'
              onChange={handleChange}
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              เลขที่เอกสาร SD
            </Typography>
            <TextField
              size='small'
              name='orderNo'
              onChange={handleChange}
              className={classes.textField}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              วันที่รับสินค้า ตั้งแต่
            </Typography>
            <DatePickerComponent onClickDate={handleStartDatePicker} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              ถึง
            </Typography>
            <DatePickerComponent onClickDate={handleEndDatePicker} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              สถานะ
            </Typography>
            <FormControl sx={{ width: 240 }}>
              <Select
                name='orderStatus'
                value={values.orderStatus}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
                defaultValue='ALL'
                autoWidth={true}
              >
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={'DRAFT'}>บันทึก</MenuItem>
                <MenuItem value={'APPROVE'}>อนุมัติ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              ประเภท
            </Typography>
            <FormControl sx={{ width: 240 }}>
              <Select
                name='orderType'
                value={values.orderType}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
                defaultValue='ALL'
                autoWidth={true}
              >
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={'PAPER'}>ลังกระดาษ</MenuItem>
                <MenuItem value={'PASTIC'}>ลังพลาสติก</MenuItem>
                <MenuItem value={'TOTE'}>สินค้าภายใน Tote</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              id='searchBtb'
              variant='contained'
              color='primary'
              onClick={onClickSearchBtn}
              className={classes.searchBtn}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>
      {items.orderList && <OrderList />}
    </div>
  );
}

export default CheckOrderSearch;
