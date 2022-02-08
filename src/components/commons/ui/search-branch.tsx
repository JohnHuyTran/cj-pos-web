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
import React, { ReactElement } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useStyles } from '../../../styles/makeTheme';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

const options = ['Option 1', 'Option 2'];

const branchList = [
  {
    id: 1,
    label: 'hello 1',
  },
  {
    id: 2,
    label: 'hello 2',
  },
  {
    id: 3,
    label: 'hello 3',
  },
];
interface ItemProps {
  label: string;
  onDelete: any;
}
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
  const [province, setProvince] = React.useState<string | null>(null);
  const [branch, setBranch] = React.useState<any | null>(null);
  const [listBranch, setListBranch] = React.useState<any | []>([]);

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleClickSearch = () => {
    setOpen(true);
  };

  const handleAddBranch = () => {
    console.log({ listBranch });

    const checkList = listBranch.some((item: any) => item.id == branch.id);
    console.log(checkList);
    if (!checkList) {
      setListBranch([...listBranch, branch]);
      setBranch(null);
    }
  };

  const handleDeleteBranch = () => {};

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
              <CancelOutlinedIcon fontSize="large" stroke={'white'} stroke-width={1} />
            </IconButton>
          ) : null}
        </Box>
        <DialogContent sx={{ padding: '50px' }}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="female" control={<Radio />} label={t('searchbranch.allBranches')} />
                  <FormControlLabel value="male" control={<Radio />} label={t('searchbranch.someBranches')} />
                </RadioGroup>
              </FormControl>
              <Box>
                <Box>
                  <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                    {t('searchbranch.province')}
                  </Typography>
                  <Autocomplete
                    options={options}
                    id="combo-box-demo"
                    popupIcon={<SearchIcon color="primary" />}
                    renderInput={(params) => <TextField {...params} />}
                    size="small"
                    className={classes.MSearchBranch}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography gutterBottom variant="subtitle1" component="div" mb={1} mr={3}>
                      {t('searchbranch.branch')}
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        disabled={false}
                        control={<Checkbox />}
                        label={t('searchbranch.selectAllBranchProvince')}
                      />
                    </FormGroup>
                  </Box>
                  <Autocomplete
                    options={branchList}
                    id="combo-box-demo"
                    popupIcon={<SearchIcon color="primary" />}
                    renderInput={(params) => <TextField {...params} />}
                    size="small"
                    className={classes.MSearchBranch}
                    getOptionLabel={(option) => option.label}
                    onChange={(event: any, newValue: any) => {
                      setBranch(newValue);
                    }}
                    value={branch}
                  />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.MbtnSearch}
                    disabled={!branch}
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
                  {listBranch.map((item: any, index: number) => (
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
