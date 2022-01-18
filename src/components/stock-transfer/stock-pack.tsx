import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { Box, Button, Grid, Typography } from '@mui/material';
import { BootstrapDialogTitle } from '../commons/ui/dialog-title';
import DatePickerComponent from '../commons/ui/date-picker-detail';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useStyles } from '../../styles/makeTheme';
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

function StockPackChecked({ isOpen, onClickClose }: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(isOpen);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [startBranch, setStartBranch] = React.useState('');
  const [endBranch, setEndBranch] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const handleChangeStartBranch = (branchCode: string) => {
    if (branchCode !== null) {
      setStartBranch(branchCode);
    } else {
      setStartBranch('');
    }
  };
  const handleChangeEndBranch = (branchCode: string) => {
    if (branchCode !== null) {
      setEndBranch(branchCode);
    } else {
      setEndBranch('');
    }
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  const handleSaveBtn = () => {};

  const handleConfirmBtn = () => {};

  return (
    <React.Fragment>
      <Dialog open={open} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClickClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>สร้างรายการโอนสินค้า</Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>เลขที่เอกสาร BT</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{'pnNo'}</Typography>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant='body2'>วันที่สร้างรายการ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant='body2'>{'create date'}</Typography>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={2}>
                วันที่โอนสินค้า* :
              </Grid>
              <Grid item xs={3}>
                <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                วันที่สิ้นสุด* :
              </Grid>
              <Grid item xs={3}>
                <DatePickerComponent
                  onClickDate={handleEndDatePicker}
                  value={endDate}
                  type={'TO'}
                  minDateTo={startDate}
                />
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={2}>
                สาขาต้นทาง* :
              </Grid>
              <Grid item xs={3}>
                <BranchListDropDown
                  sourceBranchCode={endBranch}
                  onChangeBranch={handleChangeStartBranch}
                  isClear={clearBranchDropDown}
                />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={2}>
                สาขาปลายทาง* :
              </Grid>
              <Grid item xs={3}>
                <BranchListDropDown
                  sourceBranchCode={startBranch}
                  onChangeBranch={handleChangeEndBranch}
                  isClear={clearBranchDropDown}
                />
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={2}>
                สาเหตุการโอน :
              </Grid>
              <Grid item xs={3}></Grid>
              <Grid item xs={7}></Grid>
            </Grid>
          </Box>
          <Grid
            item
            container
            xs={12}
            sx={{ mt: 3 }}
            justifyContent='space-between'
            direction='row'
            alignItems='flex-end'>
            <Grid item>
              <Button
                id='btnSave'
                variant='contained'
                color='warning'
                className={classes.MbtnSave}
                onClick={handleSaveBtn}
                startIcon={<SaveIcon />}
                sx={{ width: 200 }}>
                บันทึก
              </Button>

              <Button
                id='btnApprove'
                variant='contained'
                color='primary'
                className={classes.MbtnApprove}
                onClick={handleConfirmBtn}
                startIcon={<CheckCircleOutline />}
                sx={{ width: 200 }}>
                ส่งงานให้ DC
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default StockPackChecked;
