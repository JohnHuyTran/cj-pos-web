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
import SnackbarStatus from '../../components/commons/ui/snackbar-status';

interface State {
  documentNumber: string;
  branch: string;
  status: string;
  fromDate: any | Date | number | string;
  toDate: any | Date | number | string;
}
const SaleLimitTimeSearch = () => {
  const classes = useStyles();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const { t } = useTranslation(['barcodeDiscount', 'common']);
  const [lstStatus, setLstStatus] = React.useState([]);
  const [branchList, setBranchList] = React.useState<any[]>([]);
  const [values, setValues] = React.useState<State>({
    documentNumber: '',
    branch: '',
    status: 'ALL',
    fromDate: new Date(),
    toDate: new Date(),
  });
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  useEffect(() => {
    setLstStatus(t('lstStatus', { returnObjects: true }));
  }, []);

  const autocompleteRenderListItem = (props: any, option: any) => {
    return (
      <li {...props} key={option.code}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Typography variant="body2">{option.name}</Typography>
          <Typography variant="caption" sx={{ marginLeft: 'auto' }}>
            {option.code}
          </Typography>
        </Box>
      </li>
    );
  };
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
  const onSearch = () => {};
  const onInputBranch = () => {};
  return (
    <>
      <Box sx={{ flexGrow: 1 }} mb={3}>
        <Grid container rowSpacing={3} columnSpacing={6} mt={0.1}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id="documentNumber"
              name="documentNumber"
              size="small"
              value={values.documentNumber}
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
            <SearchBranch />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select id="status" name="status" value={values.status} onChange={onChange.bind(this, setValues, values)}>
                <MenuItem value={'ALL'} selected={true}>
                  {t('all')}
                </MenuItem>
                <MenuItem value={'1'}>{getStatusText('1')}</MenuItem>
                <MenuItem value={'2'}>{getStatusText('2')}</MenuItem>
                <MenuItem value={'3'}>{getStatusText('3')}</MenuItem>
                <MenuItem value={'4'}>{getStatusText('4')}</MenuItem>
                <MenuItem value={'5'}>{getStatusText('5')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              วันที่เริ่มงดขายสินค้า ตั้งแต่
            </Typography>
            <DatePickerComponent
              onClickDate={onChangeDate.bind(this, setValues, values, 'fromDate')}
              value={values.fromDate}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ถึง
            </Typography>
            <DatePickerComponent
              onClickDate={onChangeDate.bind(this, setValues, values, 'toDate')}
              type={'TO'}
              minDateTo={values.fromDate}
              value={values.toDate}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ textAlign: 'right', marginBottom: '20px' }}>
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
        <Button
          variant="contained"
          color="cancelColor"
          className={classes.MbtnSearch}
          sx={{ marginRight: '20px', width: '126px' }}
        >
          เคลียร์
        </Button>
        <Button variant="contained" color="primary" className={classes.MbtnSearch} sx={{ width: '126px' }}>
          เคลียร์
        </Button>
      </Box>
      <SaleLimitTimelist onSearch={onSearch} />

      {openCreateModal && (
        <STCreateModal
          type={'Create'}
          setOpenPopup={setOpenPopup}
          setPopupMsg={setPopupMsg}
          isOpen={openCreateModal}
          onClickClose={handleCloseCreateModal}
        />
      )}
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
    </>
  );
};

export default SaleLimitTimeSearch;
