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
import { Box } from '@mui/system';
import React from 'react';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useStyles } from '../../styles/makeTheme';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../store/store';

interface Props {
  values: any;
}
interface ItemProps {
  label: string;
}
export default function ViewBranch({ values }: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState<boolean>(false);
  const allBranch = values.isAllBranches;
  const options: any[] = [];
  const branches = values.appliedBranches.branchList || [];
  const provinces = values.appliedBranches.province || [];
  const totalBranches = useAppSelector((state) => state.searchBranchProvince.totalBranches);
  const { t } = useTranslation(['common']);

  const BranchItem = (props: ItemProps) => {
    const { label } = props;
    return (
      <div className="wrapper-item">
        <span>{label}</span>
      </div>
    );
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <>
      {values.appliedBranches && values.appliedBranches.branchList && values.appliedBranches.branchList.length == 1 ? (
        <Typography variant="body2">
          {values.appliedBranches.branchList[0].code}-{values.appliedBranches.branchList[0].name}
        </Typography>
      ) : (
        <>
          <Button
            style={{ color: '#446EF2', textDecoration: 'underline' }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal();
            }}
          >
            หลายสาขา
          </Button>
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
                      value={allBranch}
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label={`เลือกสาขาทั้งหมด  สาขา)`}
                        disabled={true}
                      />
                      <FormControlLabel disabled={true} value={false} control={<Radio />} label="เลือกสาขาเอง" />
                    </RadioGroup>
                  </FormControl>
                  {!allBranch && (
                    <Box>
                      <Box mb={1}>
                        <Typography gutterBottom variant="subtitle1" component="div">
                          จังหวัด
                        </Typography>
                        <Autocomplete
                          options={options}
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
                            />
                          )}
                          size="small"
                          disabled={true}
                          className={classes.MSearchBranch}
                        />
                      </Box>
                      <Box sx={{ marginBottom: '20px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography gutterBottom variant="subtitle1" component="div" mr={3}>
                            ค้นหาสาขา
                          </Typography>
                          <FormGroup>
                            <FormControlLabel
                              disabled={true}
                              control={<Checkbox checked={false} />}
                              label="เลือกสาขาทั้งหมด"
                            />
                          </FormGroup>
                        </Box>
                        <Autocomplete
                          options={options}
                          id="combo-box-branch"
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
                            />
                          )}
                          size="small"
                          className={classes.MSearchBranch}
                          disabled={true}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Button variant="contained" color="primary" className={classes.MbtnSearch} disabled={true}>
                          {t('button.add')}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={7} pr={5} mt={5}>
                  <Box className={classes.MWrapperListBranch}>
                    {allBranch ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <BranchItem label={`สาขาทั้งหมด (${totalBranches} สาขา)`} />
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {provinces.map((item: any, index: number) => (
                          <BranchItem label={`สาขาจังหวัด${item.name}`} key={index} />
                        ))}
                        {branches.map((item: any, index: number) => (
                          <BranchItem label={`${item.code}-${item.name}`} key={index} />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ textAlign: 'right', height: '43px', padding: '0 !important', marginTop: '30px' }}
                >
                  <Button variant="contained" color="info" className={classes.MbtnSearch} size="large" disabled={true}>
                    เลือกสาขา
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
