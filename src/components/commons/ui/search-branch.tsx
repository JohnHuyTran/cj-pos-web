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
  featchProvinceListAsync,
  featchBranchProvinceListAsync,
  updatePayloadBranches,
} from '../../../store/slices/search-branches-province-slice';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { paramsConvert } from '../../../utils/utils';

const BranchItem = (props: ItemProps) => {
  const { label, onDelete, ...other } = props;
  return (
    <div className="wrapper-item">
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
};

export default function SearchBranch(): ReactElement {
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
  const [value, setValue] = React.useState<string | null>(null);

  const provinceList = useAppSelector((state) => state.searchBranchProvince.provinceList);
  const branchList = useAppSelector((state) => state.searchBranchProvince.branchList);
  const totalBranches = useAppSelector((state) => state.searchBranchProvince.totalBranches);
  const payloadBranches = useAppSelector((state) => state.searchBranchProvince.payloadBranches);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (provinceList === null || provinceList.data.length == 0) dispatch(featchProvinceListAsync());
    if (branchList === null || branchList.data.length == 0) {
      dispatch(featchBranchProvinceListAsync('limit=10'));
    }
  }, []);

  useEffect(() => {
    try {
      const payload = {
        ...(!!branch && { name: branch.name }),
        ...(!!province && { province: province.name }),
        limit: '10',
      };
      const params = paramsConvert(payload);
      dispatch(featchBranchProvinceListAsync(params));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [province]);

  useEffect(() => {
    if (payloadBranches.isAllBranches) {
      setValue(`สาขาทั้งหมด (${totalBranches} สาขา)`);
    } else {
      // const stringProvince = payloadBranches.appliedBranches.province.map((item: any) => item.name).join();
      console.log(payloadBranches.appliedBranches);
    }
  }, [payloadBranches]);

  const handleCloseModal = () => {
    setOpen(false);
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

  const clearData = () => {};
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
        dispatch(featchBranchProvinceListAsync(params));
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      clearData();
    }
  };
  const handleAddBranch = () => {
    if (checked) {
      const existProvince = listBranch['provinces'].some((item: any) => item.code == province.code);
      if (!existProvince) {
        const preData = [...listBranch['provinces'], province];
        setListBranch({
          ...listBranch,
          provinces: preData,
        });
        setProvince(null);
        setChecked(false);
        setErrorProvince(null);
      } else {
        setErrorProvince('จังหวัดนี้ได้ถูกเลือกแล้ว กรุณาลบก่อนทำการเพิ่มใหม่อีกครั้ง');
      }
    } else {
      const existBranch = listBranch['branches'].some((item: any) => item.id == branch.id);
      if (!existBranch) {
        const preData = [...listBranch['branches'], branch];
        setListBranch({ ...listBranch, branches: preData });
        setBranch(null);
        setErrorBranch(null);
      } else {
        setErrorBranch('สาขานี้ได้ถูกเลือกแล้ว กรุณาลบก่อนทำการเพิ่มใหม่อีกครั้ง');
      }
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
        branchList: listBranch['branches'].map((item: any) => {
          return { name: item.name, code: item.code };
        }),
        province: listBranch['provinces'],
      },
    };
    dispatch(updatePayloadBranches(payload));
    setOpen(false);
  };

  return (
    <div>
      <TextField
        fullWidth
        className={classes.MtextFieldNumber}
        sx={{ textAlign: 'left' }}
        InputProps={{
          endAdornment: <SearchIcon color="primary" />,
          inputProps: {
            style: { textAlignLast: 'start' },
          },
        }}
        onClick={handleClickSearch}
        value={value}
      />
      <Dialog maxWidth="lg" fullWidth open={open}>
        <Box sx={{ flex: 1, ml: 2 }}>
          {handleCloseModal ? (
            <IconButton
              aria-label="close"
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
          <Grid container spacing={2} sx={{ minHeight: '465px' }}>
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
                    label={`${t('searchbranch.allBranches')} (${totalBranches} สาขา)`}
                  />
                  <FormControlLabel value={false} control={<Radio />} label={t('searchbranch.someBranches')} />
                </RadioGroup>
              </FormControl>
              {!allBranches && (
                <Box>
                  <Box mb={2}>
                    <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                      {t('searchbranch.province')}
                    </Typography>
                    <Autocomplete
                      options={provinceList.data}
                      id="combo-box-province"
                      popupIcon={<SearchIcon color="primary" />}
                      renderInput={(params) => (
                        <TextField {...params} error={!!errorProvince} helperText={errorProvince} />
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
                        {t('searchbranch.branch')}
                      </Typography>
                      <FormGroup>
                        <FormControlLabel
                          disabled={!province}
                          control={<Checkbox checked={checked} onChange={handleCheckBox} />}
                          label={t('searchbranch.selectAllBranchProvince')}
                        />
                      </FormGroup>
                    </Box>
                    <Autocomplete
                      options={branchList.data}
                      id="combo-box-branch"
                      popupIcon={<SearchIcon color="primary" />}
                      renderInput={(params) => <TextField {...params} error={!!errorBranch} helperText={errorBranch} />}
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
            <Grid item xs={7} pr={5}>
              <Box className={classes.MWrapperListBranch}>
                {allBranches ? (
                  <Box sx={{ display: 'flex', flex: 'wrap' }}>
                    <BranchItem label={`สาขาทั้งหมด (${totalBranches} สาขา)`} onDelete={() => {}} />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flex: 'wrap' }}>
                    {listBranch['provinces'].map((item: any, index: number) => (
                      <BranchItem
                        label={`สาขาจังหวัด${item.name}`}
                        onDelete={() => handleDeleteProvinceBranch(item.code)}
                        key={index}
                      />
                    ))}
                    {listBranch['branches'].map((item: any, index: number) => (
                      <BranchItem label={item.name} onDelete={() => handleDeleteBranch(item.code)} key={index} />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                color="info"
                className={classes.MbtnSearch}
                size="large"
                onClick={handleAddForm}
              >
                {t('searchbranch.addBranches')}
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
