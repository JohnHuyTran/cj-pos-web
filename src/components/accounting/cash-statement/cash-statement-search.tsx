import React from 'react';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStyles } from '../../../styles/makeTheme';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import { getBranchName } from '../../../utils/utils';
import { BranchListOptionType } from '../../../models/branch-model';
import { useAppSelector } from '../../../store/store';
import { getUserInfo } from '../../../store/sessionStore';
import { env } from '../../../adapters/environmentConfigs';
import { isGroupBranch } from '../../../utils/role-permission';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import { getCashStatementStatusInfo } from '../../../utils/enum/cash-statement-enum';
import { Download } from '@mui/icons-material';
import CashStatementList from './cash-statement-list';

interface State {
  branch: string;
  dateFrom: string;
  dateTo: string;
  statuses: string;
}
export default function CashStatementSearch() {
  const { t } = useTranslation(['cashStatement', 'common']);
  const classes = useStyles();

  const [values, setValues] = React.useState<State>({
    branch: '',
    dateFrom: '',
    dateTo: '',
    statuses: 'ALL',
  });

  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [groupBranch, setGroupBranch] = React.useState(isGroupBranch);
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
      setValues({ ...values, branch: JSON.parse(codes) });
    } else {
      setValues({ ...values, branch: '' });
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

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const handleSelectRows = async (list: any) => {
    console.log('handleSelectRows: ', JSON.stringify(list));
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              {t('documentSearchBranch')}
            </Typography>

            <BranchListDropDown
              valueBranch={valuebranchFrom}
              sourceBranchCode={''}
              onChangeBranch={handleChangeBranchFrom}
              isClear={clearBranchDropDown}
              disable={groupBranch}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              {t('documentSearchStartDate')}
            </Typography>

            <DatePickerAllComponent onClickDate={handleStartDatePicker} value={startDate} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
              {t('documentSearchEndDate')}
            </Typography>
            <DatePickerAllComponent
              onClickDate={handleEndDatePicker}
              value={endDate}
              type={'TO'}
              minDateTo={startDate}
            />
          </Grid>

          <Grid item xs={4} container>
            <Typography gutterBottom variant='subtitle1' component='div'>
              {t('documentSearchStatus')}
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id='selPiType'
                name='statuses'
                value={values.statuses}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}>
                <MenuItem value={'ALL'} selected={true}>
                  ทั้งหมด
                </MenuItem>
                {getCashStatementStatusInfo().map((item, index: number) => {
                  return (
                    <MenuItem key={item.key} value={item.key}>
                      {t(`status.${item.value}`)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mb={6}>
          <Grid container spacing={2} mt={4} mb={2}>
            <Grid item xs={5}>
              <Button
                id='btnImport'
                variant='contained'
                color='primary'
                startIcon={<Download />}
                // onClick={handleOpenUploadFileModal}
                // sx={{ minWidth: 100, display: `${!displayBtnImport ? 'none' : ''}` }}
                className={classes.MbtnSearch}>
                Import
              </Button>
              <Button
                id='btnImport'
                variant='contained'
                color='primary'
                // onClick={handleApprove2Multiple}
                // sx={{ ml: 2, minWidth: 100, display: `${!displayBtnSubmit ? 'none' : ''}` }}
                sx={{ ml: 2, minWidth: 110 }}
                className={classes.MbtnSearch}
                // disabled={selectRowsList.length === 0}
                disabled={true}>
                อนุมัติ
              </Button>
            </Grid>
            <Grid item xs={7} sx={{ textAlign: 'end' }}>
              <Button
                id='btnClear'
                variant='contained'
                // onClick={onClickClearBtn}
                sx={{ width: 110, ml: 2 }}
                className={classes.MbtnClear}
                color='cancelColor'>
                เคลียร์
              </Button>
              <Button
                id='btnSearch'
                variant='contained'
                color='primary'
                // onClick={onClickValidateForm}
                sx={{ width: 110, ml: 2 }}
                className={classes.MbtnSearch}>
                ค้นหา
              </Button>
            </Grid>
          </Grid>
        </Box>

        <CashStatementList onSelectRows={handleSelectRows} />
      </Box>
    </>
  );
}
