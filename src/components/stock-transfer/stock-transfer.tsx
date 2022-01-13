import moment from 'moment';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';
import DatePickerComponent from '../commons/ui/date-picker';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ModalCreateStockTransfer from './create-stock-transfer';
import { useAppDispatch } from '../../store/store';
import { updateAddItemsState } from '../../store/slices/add-items-slice';

import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import ReasonsListDropDown from '../stock-transfer/transfer-reasons-list-dropdown';
import { gridColumnsTotalWidthSelector } from '@material-ui/data-grid';
import LoadingModal from '../commons/ui/loading-modal';

interface State {
  limit: string;
  page: string;
  docNo: string;
  branchFrom: string;
  branchTo: string;
  dateFrom: string;
  dateTo: string;
  statuses: string;
  transferReason: string;
}

interface loadingModalState {
  open: boolean;
}

export default function SupplierCheckOrderSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [values, setValues] = React.useState<State>({
    limit: '10',
    page: '1',
    docNo: '',
    branchFrom: '',
    branchTo: '',
    dateFrom: '',
    dateTo: '',
    statuses: 'ALL',
    transferReason: '',
  });

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setBranchFromCode(codes);
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

  const handleChangeReasons = (ReasonsCode: string) => {
    if (ReasonsCode !== null) {
      let codes = JSON.stringify(ReasonsCode);
      setValues({ ...values, transferReason: JSON.parse(codes) });
    } else {
      setValues({ ...values, transferReason: '' });
    }
  };

  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const handleOpenCreateModal = async () => {
    await dispatch(updateAddItemsState({}));
    setOpenCreateModal(true);
  };
  function handleCloseCreateModal() {
    setOpenCreateModal(false);
  }

  const onClickValidateForm = () => {
    console.log('values: ', values);
  };

  const onClickClearBtn = () => {
    handleOpenLoading('open', true);
    setStartDate(null);
    setEndDate(null);
    setClearBranchDropDown(!clearBranchDropDown);
    setValues({
      limit: '10',
      page: '1',
      docNo: '',
      branchFrom: '',
      branchTo: '',
      dateFrom: '',
      dateTo: '',
      statuses: 'ALL',
      transferReason: '',
    });

    setTimeout(() => {
      handleOpenLoading('open', false);
    }, 300);
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id="txtDocNo"
              name="docNo"
              size="small"
              value={values.docNo}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="เลขที่เอกสาร BT"
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
                <MenuItem value={'1'}>บันทึก</MenuItem>
                <MenuItem value={'2'}>อยู่ระหว่างดำเนินการ</MenuItem>
                <MenuItem value={'3'}>เสร็จสิ้น</MenuItem>
                <MenuItem value={'4'}>ยกเลิก</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาเหตุการโอน
            </Typography>
            <ReasonsListDropDown onChangeReasons={handleChangeReasons} />
          </Grid>

          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent="flex-end" direction="row" alignItems="flex-end">
            <Button
              id="btnCreateStockTransferModal"
              variant="contained"
              onClick={handleOpenCreateModal}
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
              onClick={onClickClearBtn}
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
        <br />
        <hr />
      </Box>

      <LoadingModal open={openLoadingModal.open} />

      {openCreateModal && <ModalCreateStockTransfer isOpen={openCreateModal} onClickClose={handleCloseCreateModal} />}
    </>
  );
}
