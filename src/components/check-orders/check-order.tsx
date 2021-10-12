import moment from "moment";
import MomentUtils from "@date-io/moment";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Event } from '@mui/icons-material';
import { Button, Paper } from '@mui/material';


import { useAppSelector, useAppDispatch } from '../../store/store';
<<<<<<< HEAD
import { featchOrderListAsync, clearDataFilter } from '../../store/slices/check-order-slice';
import { CheckOrderRequest } from '../../models/order-model'

import OrderList from './order-list'
import { useStyles } from './order-css'
import clsx from "clsx";

import DatePicker from '@mui/lab/DatePicker'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePickerComponent from "../commons/ui/date-picker";

moment.locale("en");
=======
import {
  featchOrderListAsync,
  clearDataFilter,
} from '../../store/slices/check-order-slice';
import { ShipmentRequest } from '../../models/order-model';
import OrderList from './order-list';
import DatePickerComponent from '../commons/ui/date-picker';

moment.locale('en');

>>>>>>> feature/sp1/card-no-9
interface State {
  orderNo: string;
  orderStatus: string;
  orderType: string;
  dateFrom: string;
  dateTo: string;
}


function CheckOrderSearch() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.checkOrderList);
  const [values, setValues] = React.useState<State>({
    orderNo: '',
<<<<<<< HEAD
    orderStatus: '',
    orderType: 'WASHING-POWER'
=======
    orderStatus: 'ALL',
    orderType: 'ALL',
    dateFrom: '10/10/2021',
    dateTo: '11/10/2021',
>>>>>>> feature/sp1/card-no-9
  });
  const [locale, setLocale] = React.useState("en");
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  }

  const onClickSearchBtn = () => {
<<<<<<< HEAD
    const payload: CheckOrderRequest = {
      orderNo: values.orderNo,
      orderStatus: values.orderStatus,
      orderType: values.orderType
    }
    dispatch(featchOrderListAsync(payload));
  }
=======
    const payload: ShipmentRequest = {
      limit: '10',
      page: '1',
      shipmentNo: values.orderShipment,
      sdNo: values.orderNo,
      dateFrom: moment(startDate).format('DD/MM/YYYY'),
      dateTo: moment(endDate).format('DD/MM/YYYY'),
      sdStatus: parseInt(values.orderStatus),
      sdType: parseInt(values.orderType),
    };
    dispatch(featchOrderListAsync(payload));
    console.log(`Search Criteria: ${JSON.stringify(payload)}`);
  };
>>>>>>> feature/sp1/card-no-9

  useEffect(() => {
    dispatch(clearDataFilter());
  }, [])

  const handleStartDatePicker = (value: Date) => {
    setStartDate(value);
<<<<<<< HEAD
    var date_format = moment(value).format("YYYY/DD/MM HH:mm:ss");
    console.log("start date: ", date_format);
  }

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
    var date_format = moment(value).utc().format("YYYY/DD/MM HH:mm:ss");
    console.log("end date: ", date_format);
  }
=======
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };
>>>>>>> feature/sp1/card-no-9

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
<<<<<<< HEAD
        <Grid container spacing={2} >
          <Grid item xs={2}  >
            <Typography variant="subtitle1" gutterBottom component="div">เลขที่เอกสาร: </Typography>
          </Grid>
          <Grid item xs={2}  >
            <TextField size="small" id="outlined-basic" label="" variant="outlined" name='orderNo' onChange={handleChange} className={classes.textField} />
=======
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              เลขที่เอกสาร LD
            </Typography>
            <TextField
              size='small'
              name='orderShipment'
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1' gutterBottom component='div'>
              เลขที่เอกสาร SD
            </Typography>
            <TextField size='small' name='orderNo' onChange={handleChange} />
>>>>>>> feature/sp1/card-no-9
          </Grid>
          <Grid item xs={8}  ></Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" gutterBottom component="div">ตั้งแต่วันที่: </Typography>
            <DatePickerComponent onClickDate={handleStartDatePicker} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" gutterBottom component="div">ถึงวันที่: </Typography>
            <DatePickerComponent onClickDate={handleEndDatePicker} />

          </Grid>
          <Grid item xs={2}  >
            <Typography variant="subtitle1" gutterBottom component="div">สถานะ: </Typography>
          </Grid>
          <Grid item xs={2}  >
            <FormControl fullWidth size='small'>
              <Select
                name='orderStatus'
                value={values.orderStatus}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
<<<<<<< HEAD
              >
                <MenuItem value={'APPROVE'}>Approve</MenuItem>
                <MenuItem value={'PENDING'}>Pending</MenuItem>
                <MenuItem value={'REJECT'}>Reject</MenuItem>

=======
                autoWidth={true}
              >
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={'0'}>บันทึก</MenuItem>
                <MenuItem value={'1'}>อนุมัติ</MenuItem>
>>>>>>> feature/sp1/card-no-9
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}  ></Grid>
          <Grid item xs={2}  >
            <Typography variant="subtitle1" gutterBottom component="div">ประเภท: </Typography>
          </Grid>
          <Grid item lg={4}  >
            <FormControl fullWidth >
              <Select
                name="orderType"
                value={values.orderType}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
<<<<<<< HEAD
              >
                <MenuItem value={'PAPER'}>Paper</MenuItem>
                <MenuItem value={'PASTIC'}>Pastic</MenuItem>
                <MenuItem value={'DRINK'}>Drinks</MenuItem>
                <MenuItem value={'WASHING-POWER'}>WASHING-POWERssssssss</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}  ></Grid>
          <Grid item xs={12}  >
            <Button
              id='searchBtb'
              variant='contained'
              color='primary'
              onClick={onClickSearchBtn}
              className={classes.searchBtn}
            >SEARCH
            </Button>
=======
                autoWidth={true}
              >
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={'0'}>ลังกระดาษ/ลังพลาสติก</MenuItem>
                <MenuItem value={'1'}>สินค้าภายในTote</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                width: '150px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button
                id='searchBtb'
                variant='contained'
                color='primary'
                onClick={onClickSearchBtn}
              >
                ค้นหา
              </Button>
              <Button
                id='clearBtb'
                variant='contained'
                onClick={onClickSearchBtn}
                sx={{ backgroundColor: '#AEAEAE' }}
              >
                เคลียร์
              </Button>
            </Box>
>>>>>>> feature/sp1/card-no-9
          </Grid>
        </Grid>
      </Box>
      {items.orderList && <OrderList />}
<<<<<<< HEAD
    </div >
  )
=======
    </>
  );
>>>>>>> feature/sp1/card-no-9
}

export default CheckOrderSearch
