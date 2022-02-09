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
import { featchProvinceListAsync } from '../../../store/slices/search-branches-province-slice';
import { useAppSelector, useAppDispatch } from '../../../store/store';

const options = [
  {
    id: 1,
    label: 'Province 1',
  },
  {
    id: 2,
    label: 'Province 3',
  },
];

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
  const [open, setOpen] = React.useState(true);
  const { t } = useTranslation(['common']);
  const [province, setProvince] = React.useState<any | null>(null);
  const [branch, setBranch] = React.useState<any | null>(null);
  const [branchList, setBranchList] = React.useState<any>([]);
  const [listBranch, setListBranch] = React.useState<ListBranches>({ branches: [], provinces: [] });
  const [checked, setChecked] = React.useState<boolean>(false);
  const [allBranches, setAllBranches] = React.useState<boolean>(true);

  const provinceList = useAppSelector((state) => state.searchBranchProvince.provinceList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (provinceList === null || provinceList.data.length == 0) dispatch(featchProvinceListAsync());
  }, []);

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
      const payload = {
        name: keyword,
        province: province,
      };
      console.log({ payload });
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
      }
    } else {
      const existBranch = listBranch['branches'].some((item: any) => item.id == branch.id);
      if (!existBranch) {
        const preData = [...listBranch['branches'], branch];
        setListBranch({ ...listBranch, branches: preData });
      }
    }
    console.log({ listBranch });
  };

  const handleDeleteBranch = () => {};

  const handleDeleteProvinceBranch = () => {};

  return (
    <div>
      <TextField
        fullWidth
        className={classes.MtextFieldNumber}
        InputProps={{
          endAdornment: <SearchIcon color="primary" />,
        }}
        onClick={handleClickSearch}
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
        <DialogContent sx={{ padding: '50px' }}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="branch-radio-buttons-group-label"
                  value={allBranches}
                  name="radio-buttons-group"
                  onChange={handleChangeRadio}
                >
                  <FormControlLabel value={true} control={<Radio />} label={t('searchbranch.allBranches')} />
                  <FormControlLabel value={false} control={<Radio />} label={t('searchbranch.someBranches')} />
                </RadioGroup>
              </FormControl>
              <Box>
                <Box>
                  <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                    {t('searchbranch.province')}
                  </Typography>
                  <Autocomplete
                    options={provinceList.data}
                    id="combo-box-province"
                    popupIcon={<SearchIcon color="primary" />}
                    renderInput={(params) => <TextField {...params} />}
                    size="small"
                    className={classes.MSearchBranch}
                    getOptionLabel={(option) => option.name}
                    onChange={(event: any, newValue: any) => {
                      setProvince(newValue);
                    }}
                    value={province}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography gutterBottom variant="subtitle1" component="div" mb={1} mr={3}>
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
                    options={branchList}
                    id="combo-box-branch"
                    popupIcon={<SearchIcon color="primary" />}
                    renderInput={(params) => <TextField {...params} />}
                    size="small"
                    className={classes.MSearchBranch}
                    getOptionLabel={(option) => option.label}
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
            </Grid>
            <Grid item xs={7}>
              <Box className={classes.MWrapperListBranch}>
                <Box sx={{ display: 'flex', flex: 'wrap' }}>
                  {listBranch['provinces'].map((item: any, index: number) => (
                    <BranchItem label={item.name} onDelete={handleDeleteProvinceBranch} key={index} />
                  ))}
                  {listBranch['branches'].map((item: any, index: number) => (
                    <BranchItem label={item.label} onDelete={handleDeleteBranch} key={index} />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button variant="contained" color="info" className={classes.MbtnSearch}>
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
