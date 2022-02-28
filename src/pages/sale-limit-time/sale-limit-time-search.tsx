import { Autocomplete, Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useStyles } from '../../styles/makeTheme';
import React, { useEffect } from 'react';
import STCreateModal from '../../components/sale-limit-time/sale-limit-time-create-modal';
import SearchIcon from '@mui/icons-material/Search';
import { objectNullOrEmpty, onChange, onChangeDate, stringNullOrEmpty } from '../../utils/utils';
import { useTranslation } from 'react-i18next';
import DatePickerComponent from '../../components/commons/ui/date-picker';
import SaleLimitTimelist from './sale-limit-time-list';
import SearchBranch from '../../components/commons/ui/search-branch';
import { useAppDispatch, useAppSelector } from '../../store/store';
import SnackbarStatus from '../../components/commons/ui/snackbar-status';
import { fetchSaleLimitTimeListAsync, updatePayloadST } from '../../store/slices/sale-limit-time-search-slice';
import { getUserInfo } from '../../store/sessionStore';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';
import { paramsConvert } from '../../utils/utils';
import moment from 'moment';
import AlertError from '../../components/commons/ui/alert-error';
import { fetchBranchProvinceListAsync, updatePayloadBranches } from '../../store/slices/search-branches-province-slice';
interface State {
  query: string;
  branch: string;
  status: string;
  startDate: any | Date | number | string;
  endDate: any | Date | number | string;
}
const SaleLimitTimeSearch = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const { t } = useTranslation(['saleLimitTime', 'common']);
  const [lstStatus, setLstStatus] = React.useState([]);
  const userInfo: KeyCloakTokenInfo = getUserInfo();
  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');
  const responveST = useAppSelector((state) => state.searchSaleLimitTime.responseST);
  const payloadST = useAppSelector((state) => state.searchSaleLimitTime.payloadST);
  const branchList = useAppSelector((state) => state.searchBranchProvince.branchList);
  const [values, setValues] = React.useState<State>({
    query: '',
    branch: userInfo.branch,
    status: '1',
    startDate: new Date(),
    endDate: new Date(),
  });
  let checkAdmin = userInfo.acl['service.posback-campaign'].includes('campaign.st.create');

  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  useEffect(() => {
    setLstStatus(t('lstStatus', { returnObjects: true }));
    if (!checkAdmin) {
      const payload = {
        limit: '10',
        code: userInfo.branch,
      };
      const params = paramsConvert(payload);
      dispatch(fetchBranchProvinceListAsync(params));
    }
  }, []);
  useEffect(() => {
    if (!checkAdmin) {
      const payloadBranch = {
        isAllBranches: false,
        appliedBranches: {
          branchList: branchList.data || [],
          province: [],
        },
        saved: true,
      };

      dispatch(updatePayloadBranches(payloadBranch));
    }
  }, [branchList]);

  const getStatusText = (key: string) => {
    if (lstStatus === null || lstStatus.length === 0) {
      return '';
    }
    let item: any = lstStatus.find((item: any) => item.value === key);
    return item.label;
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };
  const handleSearchST = () => {
    if (stringNullOrEmpty(values.startDate) || stringNullOrEmpty(values.endDate)) {
      setOpenAlert(true);
      setTextError('กรุณากรอกวันที่');
    } else {
      const params = {
        page: payloadST.page,
        perPage: payloadST.perPage,
        query: values.query,
        status: values.status,
        branch: values.branch,
        startDate: moment(values.startDate).startOf('day').toISOString(),
        endDate: moment(values.endDate).endOf('day').toISOString(),
      };
      const query = paramsConvert(params);
      dispatch(fetchSaleLimitTimeListAsync(query));
    }
  };
  const onSearch = () => {};
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }} mb={3}>
        <Grid container rowSpacing={3} columnSpacing={6} mt={0.1}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id="query"
              name="query"
              size="small"
              value={values.query}
              onChange={onChange.bind(this, setValues, values)}
              InputProps={{
                endAdornment: <SearchIcon color="primary" sx={{ marginRight: '12px' }} />,
                inputProps: {
                  style: { textAlignLast: 'start' },
                },
              }}
              className={classes.MtextField}
              fullWidth
              placeholder="สาขา"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขา
            </Typography>
            <SearchBranch disabled={!checkAdmin} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="status"
                name="status"
                value={values.status}
                onChange={onChange.bind(this, setValues, values)}
                disabled={!checkAdmin}
              >
                <MenuItem value={'1'}>{getStatusText('1')}</MenuItem>
                <MenuItem value={'2'}>{getStatusText('2')}</MenuItem>
                <MenuItem value={'3'}>{getStatusText('3')}</MenuItem>
                <MenuItem value={'4'}>{getStatusText('4')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              วันที่เริ่มงดขายสินค้า ตั้งแต่
            </Typography>
            <DatePickerComponent
              onClickDate={onChangeDate.bind(this, setValues, values, 'startDate')}
              value={values.startDate}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ถึง
            </Typography>
            <DatePickerComponent
              onClickDate={onChangeDate.bind(this, setValues, values, 'endDate')}
              type={'TO'}
              minDateTo={values.startDate}
              value={values.endDate}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ textAlign: 'right', marginBottom: '20px' }}>
        {checkAdmin && (
          <Button
            id="btnCreate"
            variant="contained"
            sx={{ width: '172px', marginRight: '20px' }}
            className={classes.MbtnSearch}
            color="secondary"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleOpenCreateModal}
          >
            {'สร้างเอกสารใหม่'}
          </Button>
        )}
        <Button
          variant="contained"
          color="cancelColor"
          className={classes.MbtnSearch}
          sx={{ marginRight: '20px', width: '126px' }}
        >
          เคลียร์
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.MbtnSearch}
          sx={{ width: '126px' }}
          onClick={handleSearchST}
        >
          เคลียร์
        </Button>
      </Box>
      {checkAdmin && (
        <Box sx={{ marginBottom: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            className={classes.MbtnSearch}
            sx={{ marginRight: '20px', width: '126px' }}
            onClick={handleSearchST}
          >
            เริ่มต้นใช้งาน
          </Button>
          <Button variant="contained" color="error" className={classes.MbtnSearch} sx={{ width: '126px' }}>
            ยกเลิก
          </Button>
        </Box>
      )}
      {responveST && responveST.data && responveST.data.length > 0 ? (
        <SaleLimitTimelist onSearch={onSearch} />
      ) : (
        <Grid item container xs={12} justifyContent="center">
          <Box color="#CBD4DB">
            <h2>{t('noData')}</h2>
          </Box>
        </Grid>
      )}

      {openCreateModal && (
        <STCreateModal
          type={'Create'}
          isAdmin={checkAdmin}
          setOpenPopup={setOpenPopup}
          setPopupMsg={setPopupMsg}
          isOpen={openCreateModal}
          onClickClose={handleCloseCreateModal}
        />
      )}
      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
    </>
  );
};

export default SaleLimitTimeSearch;
