import { Box, Button, Dialog, DialogActions, DialogContent, Grid } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import DatePickerAllComponent from '../../commons/ui/date-picker-all';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
interface Props {
  open: boolean;
  onClose: () => void;
}
function ModalAddExpense({ open, onClose }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [isErrorDate, setIsErrorDate] = React.useState(false);
  const [isDisableSaveBtn, setIsDisableSaveBtn] = React.useState(false);
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleSaveBtn = () => {
    onClose();
  };
  return (
    <div>
      <Dialog open={open} maxWidth='md' fullWidth={true}>
        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
              เพิ่มรายการจ่ายวันที่ :
            </Grid>
            <Grid item xs={4}>
              <DatePickerAllComponent
                onClickDate={handleStartDatePicker}
                value={startDate}
                type={'TO'}
                minDateTo={startDate}
                maxDate={endDate}
                isError={isErrorDate}
                hyperText={isErrorDate ? 'เลือกวันที่ซ้ำ กรุณาเลือกใหม่' : ''}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                data-testid='testid-btnAdd'
                id='btnAdd'
                variant='contained'
                color='secondary'
                onClick={handleSaveBtn}
                className={classes.MbtnSearch}
                size='large'
                disabled={isErrorDate || isDisableSaveBtn ? true : false}
                startIcon={<AddCircleOutlineIcon />}>
                บันทึก
              </Button>
            </Box>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModalAddExpense;
