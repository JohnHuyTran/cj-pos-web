import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { ReactElement, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useStyles } from '../../../styles/makeTheme';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { ItemProps, ListBranches } from '../../../models/search-branch-province-model';
import {
  fetchProvinceListAsync,
  fetchBranchProvinceListAsync,
  updatePayloadBranches,
  fetchTotalBranch,
} from '../../../store/slices/search-branches-province-slice';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { paramsConvert } from '../../../utils/utils';
const _ = require('lodash');

const BranchItem = (props: ItemProps) => {
  const { label, onDelete, ...other } = props;
  return (
    <div className="wrapper-item">
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
};

interface Props {
  error?: boolean;
  helperText?: string;
}

export default function SearchBranch(props: Props): ReactElement {
  const { error, helperText } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation(['common']);
  const [province, setProvince] = React.useState<any | null>(null);
  const [branch, setBranch] = React.useState<any | null>(null);
  const [listBranch, setListBranch] = React.useState<ListBranches>({ branches: [], provinces: [] });
  const [checked, setChecked] = React.useState<boolean>(false);
  const [allBranches, setAllBranches] = React.useState<boolean>(true);
  const [errorProvince, setErrorProvince] = React.useState<string | null>();
  const [errorBranch, setErrorBranch] = React.useState<string | null>();
  const [value, setValue] = React.useState<string>('');

  const provinceList = useAppSelector((state) => state.searchBranchProvince.provinceList);
  const branchList = useAppSelector((state) => state.searchBranchProvince.branchList);
  const totalBranches = useAppSelector((state) => state.searchBranchProvince.totalBranches);
  const payloadBranches = useAppSelector((state) => state.searchBranchProvince.payloadBranches);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (provinceList === null || provinceList.data.length == 0) dispatch(fetchProvinceListAsync());
    dispatch(fetchTotalBranch());
  }, []);

  useEffect(() => {
    try {
      const payload = {
        // ...(!!branch && { name: branch.name }),
        ...(!!province && { province: province.name }),
        limit: '10',
      };
      const params = paramsConvert(payload);
      dispatch(fetchBranchProvinceListAsync(params));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [province]);

  useEffect(() => {
    if (payloadBranches.isAllBranches && payloadBranches.saved) {
      setValue(`สาขาทั้งหมด (${totalBranches} สาขา)`);
    } else {
      const stringProvince = payloadBranches.appliedBranches['province']
        .map((item: any) => `สาขาจังหวัด${item.name}`)
        .join(', ');
      const stringBranch = payloadBranches.appliedBranches['branchList']
        .map((item: any) => `${item.code}-${item.name}`)
        .join(', ');
      const stringList =
        !!stringProvince && !!stringBranch
          ? stringProvince.concat(', ', stringBranch)
          : stringProvince.concat('', stringBranch);
      setValue(stringList);
    }
  }, [payloadBranches]);

  const handleCloseModal = () => {
    setOpen(false);
    clearInput();
    setListBranch({
      branches: payloadBranches.appliedBranches['branchList'],
      provinces: payloadBranches.appliedBranches['province'],
    });
    setAllBranches(payloadBranches.isAllBranches);
  };

  const clearInput = () => {
    setProvince(null);
    setBranch(null);
    setErrorProvince(null);
    setErrorBranch(null);
    setChecked(false);
  };
  const handleClickSearch = () => {
    setOpen(true);
  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllBranches(JSON.parse(event.target.value.toLowerCase()));
  };

  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    event.target.checked && setBranch(null);
  };

  const onInputChange = async (event: any, value: string, reason: string) => {
    if (event && event.keyCode && event.keyCode === 13) {
      return false;
    }

    // if (reason == 'reset') {
    //   clearInput();
    // }

    const keyword = value.trim();
    if (keyword.length >= 3 && reason !== 'reset') {
      try {
        const payload = {
          name: keyword,
          ...(!!province && { province: province.name }),
          limit: '10',
        };
        const params = paramsConvert(payload);
        dispatch(fetchBranchProvinceListAsync(params));
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  };
  const handleAddBranch = () => {
    if (checked) {
      const existProvince = listBranch['provinces'].some((item: any) => item.code == province.code);
      if (!existProvince) {
        const preData = [...listBranch['provinces'], province];
        const newBranches = listBranch['branches'].filter((item: any) => item.province.code !== province.code);
        const checkArrays = _.difference(listBranch['branches'], newBranches);
        if (checkArrays.length > 0) {
          setListBranch({
            ...listBranch,
            branches: newBranches,
            provinces: preData,
          });
        } else {
          setListBranch({
            ...listBranch,
            provinces: preData,
          });
        }
        // setErrorProvince(null);
      }
      setProvince(null);
      setChecked(false);
      // else {
      //   setErrorProvince('จังหวัดนี้ได้ถูกเลือกแล้ว กรุณาลบก่อนทำการเพิ่มใหม่อีกครั้ง');
      // }
    } else {
      const existBranch = listBranch['branches'].some((item: any) => item.id == branch.id);
      const existInProvince = listBranch['provinces'].some((item: any) => item.code == branch.province.code);

      if (!existBranch && !existInProvince) {
        const preData = [...listBranch['branches'], branch];
        setListBranch({ ...listBranch, branches: preData });
      }
      setProvince(null);
      setBranch(null);
      setErrorBranch(null);
      // else {
      //   setErrorBranch('สาขานี้ได้ถูกเลือกแล้ว กรุณาลบก่อนทำการเพิ่มใหม่อีกครั้ง');
      // }
    }
  };

  const handleDeleteBranch = (code: string) => {
    const newList = listBranch['branches'].filter((item: any) => item.code !== code);
    setListBranch({ ...listBranch, branches: newList });
  };

  const handleDeleteProvinceBranch = (code: string) => {
    const newList = listBranch['provinces'].filter((item: any) => item.code !== code);
    setListBranch({ ...listBranch, provinces: newList });
  };

  const handleAddForm = () => {
    const payload = {
      isAllBranches: allBranches,
      appliedBranches: {
        branchList: listBranch['branches'],
        province: listBranch['provinces'],
      },
      saved: true,
    };
    dispatch(updatePayloadBranches(payload));
    setOpen(false);
  };

  const handleClearForm = () => {
    setListBranch({ branches: [], provinces: [] });
  };

  return (
    <div>
      <TextField
        fullWidth
        className={`${classes.MtextFieldNumber} ${classes.MSearchBranchInput}`}
        sx={{ textAlign: 'left' }}
        InputProps={{
          endAdornment: <SearchIcon color="primary" sx={{ marginRight: '12px' }} />,
          inputProps: {
            style: { textAlignLast: 'start' },
          },
        }}
        onClick={handleClickSearch}
        value={value}
        error={error}
        helperText={helperText}
        FormHelperTextProps={{
          style: {
            textAlign: 'right',
            marginRight: 0,
          },
        }}
        placeholder="กรุณาเลือก"
      />
      <Dialog maxWidth="lg" fullWidth open={open}>
        <Box sx={{ flex: 1, ml: 2 }}>
          {handleCloseModal ? (
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme: any) => theme.palette.grey[400],
              }}
            >
              <CancelOutlinedIcon fontSize="large" stroke={'white'} strokeWidth={1} />
            </IconButton>
          ) : null}
        </Box>
        <DialogContent sx={{ padding: '45px 24px 32px 100px' }}>
          <Grid container spacing={2}>
            <Grid item xs={5} pr={4}>
              <FormControl sx={{ marginBottom: '15px' }}>
                <RadioGroup
                  aria-labelledby="branch-radio-buttons-group-label"
                  value={allBranches}
                  name="radio-buttons-group"
                  onChange={handleChangeRadio}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={`เลือกสาขาทั้งหมด (${totalBranches} สาขา)`}
                  />
                  <FormControlLabel value={false} control={<Radio />} label="เลือกสาขาเอง" />
                </RadioGroup>
              </FormControl>
              {!allBranches && (
                <Box>
                  <Box mb={1}>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      จังหวัด
                    </Typography>
                    <Autocomplete
                      options={provinceList.data}
                      id="combo-box-province"
                      popupIcon={<SearchIcon color="primary" />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          FormHelperTextProps={{
                            style: {
                              textAlign: 'right',
                              marginRight: 0,
                            },
                          }}
                          error={!!errorProvince}
                          helperText={errorProvince}
                        />
                      )}
                      size="small"
                      className={classes.MSearchBranch}
                      getOptionLabel={(option) => option.name}
                      onChange={(event: any, newValue: any) => {
                        setProvince(newValue);
                        !newValue && setChecked(false);
                      }}
                      value={province}
                    />
                  </Box>
                  <Box sx={{ marginBottom: '20px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography gutterBottom variant="subtitle1" component="div" mr={3}>
                        ค้นหาสาขา
                      </Typography>
                      <FormGroup>
                        <FormControlLabel
                          disabled={!province}
                          control={<Checkbox checked={checked} onChange={handleCheckBox} />}
                          label="เลือกสาขาทั้งหมด"
                        />
                      </FormGroup>
                    </Box>
                    <Autocomplete
                      options={branchList.data}
                      id="combo-box-branch"
                      popupIcon={<SearchIcon color="primary" />}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!errorBranch}
                          helperText={errorBranch}
                          FormHelperTextProps={{
                            style: {
                              textAlign: 'right',
                              marginRight: 0,
                            },
                          }}
                        />
                      )}
                      size="small"
                      className={classes.MSearchBranch}
                      getOptionLabel={(option) => option.name}
                      onChange={(event: any, newValue: any) => {
                        setBranch(newValue);
                      }}
                      onInputChange={onInputChange}
                      value={branch}
                      disabled={checked}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.MbtnSearch}
                      disabled={!branch && !checked}
                      onClick={handleAddBranch}
                    >
                      {t('button.add')}
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={7} pr={5} mt={5}>
              <Box className={classes.MWrapperListBranch}>
                {allBranches ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <BranchItem label={`สาขาทั้งหมด (${totalBranches} สาขา)`} onDelete={() => {}} />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {listBranch['provinces'].map((item: any, index: number) => (
                      <BranchItem
                        label={`สาขาจังหวัด${item.name}`}
                        onDelete={() => handleDeleteProvinceBranch(item.code)}
                        key={index}
                      />
                    ))}
                    {listBranch['branches'].map((item: any, index: number) => (
                      <BranchItem
                        label={`${item.code}-${item.name}`}
                        onDelete={() => handleDeleteBranch(item.code)}
                        key={index}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right', height: '43px', padding: '0 !important', marginTop: '30px' }}>
              {!allBranches && (
                <Button
                  variant="contained"
                  color="cancelColor"
                  className={classes.MbtnSearch}
                  size="large"
                  onClick={handleClearForm}
                  sx={{ marginRight: '15px' }}
                >
                  เคลียร์
                </Button>
              )}
              <Button
                variant="contained"
                color="info"
                className={classes.MbtnSearch}
                size="large"
                onClick={handleAddForm}
              >
                เลือกสาขา
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        {/* <DialogActions>
          <Button>Ok</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
