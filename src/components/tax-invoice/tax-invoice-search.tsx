import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import TaxInvoiceSearchList from './tax-invoice-search-list';
import { useAppDispatch, useAppSelector } from '../../store/store';

interface State {
  docNo: string;
}

export default function TaxInvoiceSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [disableSearchBtn, setDisableSearchBtn] = React.useState(false);
  const [values, setValues] = React.useState<State>({
    docNo: '',
  });
  const [flagSearch, setFlagSearch] = React.useState(false);

  const items = useAppSelector((state) => state.dcCheckOrderList);
  const taxInvoiceList = items.orderList.data ? items.orderList.data : [];

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const onClickClearBtn = () => {
    setValues({
      docNo: '',
    });
  };

  const onClickSearchBtn = () => {
    setFlagSearch(true);
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id='txtDocNo'
              name='docNo'
              size='small'
              value={values.docNo}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder='เลขที่ใบเสร็จ/ใบกำกับ'
              autoComplete='off'
            />
          </Grid>
          <Grid item xs={8} container alignItems='flex-end'></Grid>
          <Grid item xs={8} container alignItems='flex-end'></Grid>
          <Grid item xs={4} container alignItems='flex-end'>
            <Grid item container xs={12} sx={{ mt: 3 }} justifyContent='flex-end' direction='row' alignItems='flex-end'>
              <Button
                id='btnClear'
                variant='contained'
                onClick={onClickClearBtn}
                sx={{ width: '45%' }}
                className={classes.MbtnClear}
                color='cancelColor'
                fullWidth={true}>
                เคลียร์
              </Button>
              <Button
                id='btnSearch'
                variant='contained'
                color='primary'
                onClick={onClickSearchBtn}
                sx={{ width: '45%', ml: 1, display: `${disableSearchBtn ? 'none' : ''}` }}
                className={classes.MbtnSearch}
                fullWidth={true}>
                ค้นหา
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {flagSearch && taxInvoiceList.length > 0 && <TaxInvoiceSearchList />}
      {flagSearch && taxInvoiceList.length <= 0 && (
        <Grid item container xs={12} justifyContent='center'>
          <Box color='#CBD4DB'>
            <br></br>
            <h2>ไม่มีข้อมูล</h2>
          </Box>
        </Grid>
      )}
    </>
  );
}
