import { Fragment, useEffect, useState } from 'react';
import { 
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormHelperText
} from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { useStyles } from '../../../styles/makeTheme';
import { Upload, AddCircleOutline } from '@mui/icons-material';
import { expenseTypes, expenseStatusList } from '../../../utils/enum/accounting-enum';
import DatePickerMonth from '../../../components/commons/ui/date-picker-month';

// Import File ที่เกี่ยวข้องกับ Business Logic Select สาขา
import BranchListDropDown from '../../../components/commons/ui/branch-list-dropdown';
import { getUserInfo } from '../../../store/sessionStore';
import { isGroupBranch } from '../../../utils/role-permission';
import { getBranchName } from '../../../utils/utils';
import { BranchListOptionType } from '../../../models/branch-model';
import { env } from '../../../adapters/environmentConfigs';
import { useAppSelector } from '../../../store/store';

interface FormSelectProps {
  title: string,
	dataList: any[];
  value: any;
  setValue: (value: any) => void;
	defaultValue?: string;
  isValidate?: boolean;
  isDisabled?: boolean;
}

export default function SearchExpense () {
  const classes = useStyles()
  // Business Logic Select สาขา
  const groupBranch = isGroupBranch()
  const branchList = useAppSelector((state) => state.searchBranchSlice).branchList.data;
  const ownBranch =  getUserInfo().branch
    ? getBranchName(branchList, getUserInfo().branch)
      ? getUserInfo().branch
      : env.branch.code
    : env.branch.code
  const branchFrom = getBranchName(branchList, ownBranch);
  const branchFromMap: BranchListOptionType = {
    code: ownBranch,
    name: branchFrom ? branchFrom : ''
  }
  const valuebranchFrom = groupBranch ? branchFromMap : null

  const initialSearchState = {
    type: '',
    branchCode: '',
    status: 'WAITTING_APPROVAL3',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    period: '',
  }

  // Set state data
  const [search, setSearch] = useState(initialSearchState);
  const [expensePeriodList, setexpensePeriodList] = useState<object[]>([]);
  const [isSearch, setIsSearch] = useState(false)
  const [isValidate, setIsValidate] = useState(false)
  const [branchFromCode, setBranchFromCode] = useState('');
  const [isOpenLoading, setIsOpenLoading] = useState(false);

  // Lifecycle hooks
  useEffect(() => {
    if (groupBranch) {
      setBranchFromCode(ownBranch);
      setSearch({ ...search, branchCode: ownBranch });
    }
  }, [])
  
  useEffect(() => {
     // Select งวดเบิก
     if (search.type === 'COFFEE') { // ถ้าเป็นค่าใช้จ่ายหน้าร้าน
      setSearch({...search, period: '1'})
      setexpensePeriodList([{key: '1', text: 'รายเดือน'}])
    } else {
      setSearch({...search, period: ''})
      setexpensePeriodList([ // ถ้าเป็นค่าใช้จ่ายร้านกาแฟ
        {key: '1', text: 'ครึ่งเดือนแรก'},
        {key: '2', text: 'ครึ่งเดือนหลัง'}
      ])
    }
  }, [search.type])

  
  // Handle function
  const handleClearSearch = () => {
    setSearch({...initialSearchState})
  }

  const handleSearchExpense = () => {
    setIsValidate(true)
    if (search.type && search.status) {
      setIsSearch(true)
      setIsOpenLoading(true)
      setTimeout(() => {
        setIsValidate(false)
        setIsOpenLoading(false)
      }, 1000)
    }
    // setSearch({...search})
  }

  const handleExport = () => {
  }

  const handleApprove = () => {
  }
  
  const handleApproveAll = () => {
  }
  
  const handleCoffee = () => {
  }
  
  const handleStorefront = () => {
  }

  return (
    <Fragment>
      <Grid container rowSpacing={1} columnSpacing={7}>
        <Grid item md={4} sm={4} xs={6}>
          <FormSelect
            title="ประเภท"
            dataList={expenseTypes}
            value={search.type}
            isDisabled={isOpenLoading}
            isValidate={isValidate}
            setValue={(e) => setSearch({...search, type: e.target.value})} />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
            สาขา
          </Typography>
          <BranchListDropDown
            valueBranch={valuebranchFrom}
            sourceBranchCode={branchFromCode}
            onChangeBranch={(value) => setSearch({...search, branchCode: value})}
            isClear={false}
            disable={groupBranch || isOpenLoading}
            isFilterAuthorizedBranch={groupBranch ? false : true}
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <FormSelect
              title="สถานะ"
              dataList={expenseStatusList}
              value={search.status}
              isValidate={isValidate}
              isDisabled={isOpenLoading}
              setValue={(e) => setSearch({...search, status: e.target.value})} />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
            เดือน
          </Typography>
          <DatePickerMonth
            value={new Date(`${search.year}-${search.month}`)}
            isDisabled={isOpenLoading}
            onClickDate={(value :any) =>
              setSearch(
                {...search,
                  month: value.month.number,
                  year: value.year - 543
              })
            }
          />
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <FormSelect
              title="งวดเบิก"
              dataList={expensePeriodList}
              value={search.period}
              isValidate={isValidate}
              isDisabled={isOpenLoading}
              setValue={(e) => setSearch({...search, period: e.target.value})} />
        </Grid>
      </Grid>
      <Grid container rowSpacing={1} columnSpacing={8} mt={10}>
        <Grid item md={5} sm={5} xs={12}>
          <Button
            id="btnExport"
            variant="contained"
            color="primary"
            onClick={handleExport}
            sx={{ width: '170.42px', mr: 2 }}
            startIcon={<Upload />}
            className={classes.MbtnSearch}>
            EXPORT
          </Button>
          { (isSearch && !isValidate) && 
            <Fragment>
              <Button
                id="btnSearch"
                variant="contained"
                color="primary"
                onClick={handleApprove}
                sx={{ width: '170.42px', mr: 2 }}
                className={classes.MbtnSearch}>
                อนุมัติ
              </Button>
              <Button
                id="btnSearch"
                variant="contained"
                disabled={search.status !== 'WAITTING_APPROVAL3'}
                onClick={handleApproveAll}
                sx={{ 
                  width: '170.42px',
                  background: '#5468ff',
                  ":hover": {boxShadow: 6, background: '#3e4cb8'}
                }}
                className={classes.MbtnSearch}>
                อนุมัติทั้งหมด
              </Button>
            </Fragment>
          }
        </Grid>
        <Grid item md={7} sm={7} xs={12} sx={{textAlign: 'right'}}>
          <Button
            id="btnCoffee"
            variant="contained"
            color="primary"
            onClick={handleCoffee}
            startIcon={<AddCircleOutline />}
            sx={{ 
              width: '170.42px', mr: 2,
              background: '#5468ff',
              ":hover": {boxShadow: 6, background: '#3e4cb8'}
            }}
            className={classes.MbtnSearch}>
            ค่าใช้จ่ายร้านกาแฟ
          </Button>
          <Button
            id="btnStorefront"
            variant="contained"
            color="warning"
            onClick={handleStorefront}
            sx={{ width: '170.42px', mr: 2 }}
            startIcon={<AddCircleOutline />}
            className={classes.MbtnSearch}>
            ค่าใช้จ่ายหน้าร้าน
          </Button>
          <Button
            id="btnClear"
            variant="contained"
            disabled={isOpenLoading}
            onClick={handleClearSearch}
            sx={{ width: '170.42px' }}
            className={classes.MbtnClear}
            color="cancelColor">
            เคลียร์
          </Button>
          <LoadingButton
            id="btnSearch"
            variant="contained"
            color="primary"
            onClick={handleSearchExpense}
            loading={isOpenLoading}
            loadingIndicator={
              <Typography component="span" sx={{ fontSize: '11px'}}>
                กรุณารอสักครู่{' '}
                <CircularProgress color="inherit" size={15} />
              </Typography>
            }
            sx={{ width: '170.42px', ml: 2 }}
            className={classes.MbtnSearch}>
            ค้นหา
          </LoadingButton>
        </Grid>
      </Grid>
    </Fragment>
  )
}

const FormSelect = ({
  title,
  value,
  setValue,
  dataList,
  isValidate,
  isDisabled
}: FormSelectProps) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Typography gutterBottom variant='subtitle1' component='div' mb={1}>
        {title}
      </Typography>
      <FormControl id="SearchType" className={classes.Mselect}
        fullWidth error={value === "" && isValidate}>
        <Select
          id='type'
          name='type'
          value={value}
          disabled={isDisabled}
          onChange={(e) => setValue(e)}
          displayEmpty
          renderValue={
            value !== "" 
            ? undefined
            : () => <div style={{color: '#CBD4DB'}}>{`กรุณาเลือก${title}`}</div>
          }
          inputProps={{ 'aria-label': 'Without label' }}>
            { dataList.map((item, index: number) => (
                <MenuItem key={index} value={item.key}>
                  {item.text}
                </MenuItem>
              ))
            }
        </Select>
        { (value === "" && isValidate) && 
          <FormHelperText sx={{ml: 0}}>{`กรุณาเลือก${title}`}</FormHelperText>
        }
      </FormControl>
    </Fragment>
  )
}