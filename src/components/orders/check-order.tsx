import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Event } from '@mui/icons-material';
import { Button } from '@mui/material';

import { useAppSelector, useAppDispatch } from '../../store/store';
import { featchOrderListAsync } from '../../store/slices/check-order-slice';
import { CheckOrderType } from '../../models/order'

interface State {
    orderNo: string;
    orderStatus: string;
    orderType: string;
}
function CheckOrderSearch() {
    const dispatch = useAppDispatch();
    const [values, setValues] = React.useState<State>({
        orderNo: '',
        orderStatus: '',
        orderType: ''
    });


    const handleChange = (event: any) => {
        const value = event.target.value;
        setValues({ ...values, [event.target.name]: value });
    }

    const onClickSearchBtn = () => {
        const payload: CheckOrderType = {
            orderNo: values.orderNo,
            orderStatus: values.orderStatus,
            orderType: values.orderType
        };
        dispatch(featchOrderListAsync(payload));
    }




    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}  >
                        <Typography variant="subtitle1" gutterBottom component="div">เลขที่เอกสาร:</Typography>
                    </Grid>
                    <Grid item xs={6}  >
                        <TextField id="outlined-basic" label="" variant="outlined" name='orderNo' onChange={handleChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" gutterBottom component="div">ตั้งแต่วันที่:</Typography>

                        <TextField id="outlined-basic" label="" variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1" gutterBottom component="div">ถึงวันที่: </Typography><TextField id="outlined-basic" label="" variant="outlined" />
                    </Grid>
                    <Grid item xs={6}  >
                        <Typography variant="subtitle1" gutterBottom component="div">สถานะ:</Typography>
                    </Grid>
                    <Grid item xs={6}  >
                        <FormControl fullWidth>
                            <Select
                                name='orderStatus'
                                value={values.orderStatus}
                                onChange={handleChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value={'ALL'}>All</MenuItem>
                                <MenuItem value={'PENDING'}>Pending</MenuItem>
                                <MenuItem value={'COMPLETE'}>Complete</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}  >
                        <Typography variant="subtitle1" gutterBottom component="div">ประเภท:</Typography>
                    </Grid>
                    <Grid item xs={6}  >
                        <FormControl fullWidth>
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
                            </Select>
                        </FormControl>
                    </Grid>
                    <Button onClick={onClickSearchBtn}>Search</Button>
                </Grid>
            </Box>
        </div >
    )
}

export default CheckOrderSearch
