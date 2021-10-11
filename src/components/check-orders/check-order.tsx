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
interface State {
    orderNo: string;
    orderStatus: string;
    orderType: string;
}


function CheckOrderSearch() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.checkOrderList);
    const [values, setValues] = React.useState<State>({
        orderNo: '',
        orderStatus: '',
        orderType: 'WASHING-POWER'
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
        const payload: CheckOrderRequest = {
            orderNo: values.orderNo,
            orderStatus: values.orderStatus,
            orderType: values.orderType
        }
        dispatch(featchOrderListAsync(payload));
    }

    useEffect(() => {
        dispatch(clearDataFilter());
    }, [])

    const handleStartDatePicker = (value: Date) => {
        setStartDate(value);
        var date_format = moment(value).format("YYYY/DD/MM HH:mm:ss");
        console.log("start date: ", date_format);
    }

    const handleEndDatePicker = (value: Date) => {
        setEndDate(value);
        var date_format = moment(value).utc().format("YYYY/DD/MM HH:mm:ss");
        console.log("end date: ", date_format);
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} >
                    <Grid item xs={2}  >
                        <Typography variant="subtitle1" gutterBottom component="div">เลขที่เอกสาร: </Typography>
                    </Grid>
                    <Grid item xs={2}  >
                        <TextField size="small" id="outlined-basic" label="" variant="outlined" name='orderNo' onChange={handleChange} className={classes.textField} />
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
                            >
                                <MenuItem value={'APPROVE'}>Approve</MenuItem>
                                <MenuItem value={'PENDING'}>Pending</MenuItem>
                                <MenuItem value={'REJECT'}>Reject</MenuItem>

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
                    </Grid>
                </Grid>
            </Box>
            {items.orderList && <OrderList />}
        </div >
    )
}

export default CheckOrderSearch
