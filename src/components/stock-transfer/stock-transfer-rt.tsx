import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography, TextField, FormControl, Select, MenuItem, Button } from '@mui/material';
import { useStyles } from '../../styles/makeTheme';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import DatePickerComponent from '../commons/ui/date-picker';
import ReasonsListDropDown from './transfer-reasons-list-dropdown';
import AlertError from '../commons/ui/alert-error';
import LoadingModal from '../commons/ui/loading-modal';

interface State {
  docNo: string;
  branchFrom: string;
  branchTo: string;
  dateFrom: string;
  dateTo: string;
  statuses: string;
  //   transferReason: string;
}

interface loadingModalState {
  open: boolean;
}

export default function StockTransferRt() {
  const { t } = useTranslation(['stockTransfer', 'common']);
  const classes = useStyles();
  const [values, setValues] = React.useState<State>({
    docNo: '',
    branchFrom: '',
    branchTo: '',
    dateFrom: '',
    dateTo: '',
    statuses: 'ALL',
    // transferReason: '',
  });

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setBranchFromCode(branchCode);
      setValues({ ...values, branchFrom: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchFrom: '' });
    }
  };

  const handleChangeBranchTo = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchTo: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchTo: '' });
    }
  };

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  //   const handleChangeReasons = (ReasonsCode: string) => {
  //     if (ReasonsCode !== null) {
  //       let codes = JSON.stringify(ReasonsCode);
  //       setValues({ ...values, transferReason: JSON.parse(codes) });
  //     } else {
  //       setValues({ ...values, transferReason: '' });
  //     }
  //   };

  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const onClickValidateForm = () => {
    if (values.branchFrom === '') {
      setOpenAlert(true);
      setTextError('กรุณาระบุสาขาต้นทาง');
    } else if (values.branchTo === '') {
      setOpenAlert(true);
      setTextError('กรุณาระบุสาขาปลายทาง');
    } else {
      //   onClickSearchBtn();
      console.log('pass validate');
    }
  };

  //alert Errormodel
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  //check dateFrom-dateTo
  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              {t('documentSearch')}
            </Typography>
            <TextField
              id="txtDocNo"
              name="docNo"
              size="small"
              //   value={values.docNo}
              //   onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="เลขที่เอกสาร RT"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาต้นทาง*
            </Typography>
            <BranchListDropDown
              sourceBranchCode={''}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาปลายทาง*
            </Typography>
            <BranchListDropDown
              sourceBranchCode={branchFromCode}
              onChangeBranch={handleChangeBranchTo}
              isClear={clearBranchDropDown}
            />
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div">
              วันที่รับสินค้า
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div">
              ตั้งแต่
            </Typography>
            <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
              ถึง
            </Typography>
            <DatePickerComponent onClickDate={handleEndDatePicker} value={endDate} type={'TO'} minDateTo={startDate} />
          </Grid>
          <Grid item xs={4} container>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selPiType"
                name="statuses"
                value={values.statuses}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={'0'}>บันทึก</MenuItem>
                <MenuItem value={'1'}>อยู่ระหว่างดำเนินการ</MenuItem>
                <MenuItem value={'2'}>เสร็จสิ้น</MenuItem>
                <MenuItem value={'3'}>ยกเลิก</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาเหตุการโอน
            </Typography>
            <ReasonsListDropDown onChangeReasons={handleChangeReasons} isClear={clearBranchDropDown} />
          </Grid> */}

          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent="flex-end" direction="row" alignItems="flex-end">
            <Button
              id="btnCreateStockTransferModal"
              variant="contained"
              //   onClick={handleOpenCreateModal}
              sx={{ minWidth: '15%' }}
              className={classes.MbtnClear}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color="secondary"
            >
              สร้างรายการโอน
            </Button>
            <Button
              id="btnClear"
              variant="contained"
              //   onClick={onClickClearBtn}
              sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnClear}
              color="cancelColor"
            >
              เคลียร์
            </Button>
            <Button
              id="btnSearch"
              variant="contained"
              color="primary"
              onClick={onClickValidateForm}
              sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnSearch}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>

      <LoadingModal open={openLoadingModal.open} />

      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </>
  );
}
