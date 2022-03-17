import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import TaxInvoiceSearchList from './tax-invoice-search-list';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { TaxInvoiceRequest } from '../../models/tax-invoice-model';
import { featchTaxInvoiceListAsync, savePayloadSearchList } from '../../store/slices/tax-invoice-search-list-slice';
import LoadingModal from '../commons/ui/loading-modal';
import { ACTIONS } from '../../utils/enum/permission-enum';
import { isAllowActionPermission } from '../../utils/role-permission';

interface State {
  docNo: string;
}
interface loadingModalState {
  open: boolean;
}

export default function TaxInvoiceSearch() {
  const classes = useStyles();
  const page = '1';
  const dispatch = useAppDispatch();
  const [disableSearchBtn, setDisableSearchBtn] = React.useState(true);
  const [hideSearchBtn, setHideSearchBtn] = React.useState(true);
  const [values, setValues] = React.useState<State>({
    docNo: '',
  });
  const [flagSearch, setFlagSearch] = React.useState(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const items = useAppSelector((state) => state.dcCheckOrderList);
  const limit = useAppSelector((state) => state.dcCheckOrderList.orderList.perPage);
  const taxInvoiceList = items.orderList.data ? items.orderList.data : [];

  const handleChange = (event: any) => {
    const value = event.target.value;
  };

  const onChangeDocNo = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    if (value.length >= 6) {
      setDisableSearchBtn(false);
    } else {
      setDisableSearchBtn(true);
    }
  };

  const onClickClearBtn = async () => {
    setValues({
      docNo: '',
    });
    const payload: TaxInvoiceRequest = {
      limit: limit ? limit.toString() : '10',
      page: page,
      docNo: values.docNo,
    };
    await dispatch(savePayloadSearchList(payload));
    setDisableSearchBtn(true);
    setFlagSearch(false);
  };

  const onClickSearchBtn = async () => {
    handleOpenLoading('open', true);
    let limits;
    if (limit === 0 || limit === undefined) {
      limits = '10';
    } else {
      limits = limit.toString();
    }
    const payload: TaxInvoiceRequest = {
      limit: limits,
      page: page,
      docNo: values.docNo,
    };
    await dispatch(featchTaxInvoiceListAsync(payload));
    await dispatch(savePayloadSearchList(payload));
    setFlagSearch(true);
    handleOpenLoading('open', false);
  };

  React.useEffect(() => {
    setHideSearchBtn(isAllowActionPermission(ACTIONS.SALE_TAX_INVOICE_VIEW));
  }, []);
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
              onChange={onChangeDocNo}
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
                sx={{ width: '45%', ml: 1, display: `${hideSearchBtn ? 'none' : ''}` }}
                className={classes.MbtnSearch}
                fullWidth={true}
                disabled={disableSearchBtn}>
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

      <LoadingModal open={openLoadingModal.open} />
    </>
  );
}
