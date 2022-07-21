import { Box, Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import { getStockTransferStatusList } from '../../../utils/enum/stock-transfer-enum';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UpdateIcon from '@mui/icons-material/Update';
import { getUserInfo } from '../../../store/sessionStore';
import { getBranchName } from '../../../utils/utils';
import { env } from '../../../adapters/environmentConfigs';
import { BranchListOptionType } from '../../../models/branch-model';
import { isGroupBranch } from '../../../utils/role-permission';
import { closeSaleShift } from '../../../utils/enum/accounting-enum';

function CloseSaleShiftSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };
  const [values, setValues] = React.useState({
    status: 'ALL',
    branchFrom: '',
  });
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
  const [branchFromCode, setBranchFromCode] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [ownBranch, setOwnBranch] = React.useState(
    getUserInfo().branch
      ? getBranchName(branchList, getUserInfo().branch)
        ? getUserInfo().branch
        : env.branch.code
      : env.branch.code
  );

  const branchFrom = getBranchName(branchList, ownBranch);
  const branchFromMap: BranchListOptionType = {
    code: ownBranch,
    name: branchFrom ? branchFrom : '',
  };
  const [valuebranchFrom, setValuebranchFrom] = React.useState<BranchListOptionType | null>(
    groupBranch ? branchFromMap : null
  );
  const handleChangeBranchFrom = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setBranchFromCode(branchCode);
      setValues({ ...values, branchFrom: JSON.parse(codes) });
    } else {
      setValues({ ...values, branchFrom: '' });
    }
  };
  const onClickValidateForm = () => {};
  const onClickClearBtn = () => {};
  const handleOpenCloseSale = () => {};
  const handleOnBypass = () => {};
  const handleOnupdate = () => {};
  const handleChange = () => {};
  return (
    <>
      {' '}
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              สาขา
            </Typography>
            <BranchListDropDown
              valueBranch={valuebranchFrom}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
              isFilterAuthorizedBranch={groupBranch ? false : true}
              disable={groupBranch}
              sourceBranchCode={branchFromCode}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              สถานะรหัส
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id='status'
                name='status'
                value={values.status}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}>
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                {closeSaleShift.map((item: any, index: number) => {
                  return <MenuItem value={item.key}>{item.text}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div'>
              วันที่ยอดขาย
            </Typography>
            <DatePickerAllComponent
              onClickDate={handleStartDatePicker}
              value={startDate}
              disabled={groupBranch ? true : false}
            />
          </Grid>
        </Grid>
      </Box>
      <Box mb={6}>
        <Grid container spacing={2} mt={4} mb={2}>
          <Grid item xs={5}>
            <Button
              id='btnImport'
              variant='contained'
              color='primary'
              startIcon={<UpdateIcon />}
              onClick={handleOnupdate}
              sx={{ minWidth: 100 }}
              className={classes.MbtnSearch}>
              อัพเดท
            </Button>
            <Button
              id='btnImport'
              variant='contained'
              color='primary'
              onClick={handleOnBypass}
              sx={{ ml: 2, minWidth: 100 }}
              className={classes.MbtnSearch}
              disabled={true}
              startIcon={<ArrowBackIcon />}>
              Bypass
            </Button>
          </Grid>
          <Grid item xs={7} sx={{ textAlign: 'end' }}>
            <Button
              id='btnCreateStockTransferModal'
              variant='contained'
              onClick={handleOpenCloseSale}
              sx={{ width: 150 }}
              className={classes.MbtnClear}
              color='secondary'
              disabled={true}>
              ปิดรอบยอดการขาย
            </Button>
            <Button
              id='btnClear'
              variant='contained'
              onClick={onClickClearBtn}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnClear}
              color='cancelColor'>
              เคลียร์
            </Button>
            <Button
              id='btnSearch'
              variant='contained'
              color='primary'
              onClick={onClickValidateForm}
              sx={{ width: 110, ml: 2 }}
              className={classes.MbtnSearch}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default CloseSaleShiftSearch;
