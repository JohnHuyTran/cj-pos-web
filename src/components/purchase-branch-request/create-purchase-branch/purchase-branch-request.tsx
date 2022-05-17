import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import BranchListDropDown from '../../commons/ui/branch-list-dropdown';
import DatePickerComponent from '../../commons/ui/date-picker';

function PurchaseBranchRequest() {
  const { t } = useTranslation(['purchaseBranch', 'common']);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const handleChangeBranch = (branchCode: string) => {
    console.log('branch: ', branchCode);
    // if (branchCode !== null) {
    //   let codes = JSON.stringify(branchCode);
    //   setBranchFromCode(branchCode);
    //   setValues({ ...values, branchFrom: JSON.parse(codes) });
    // } else {
    //   setValues({ ...values, branchFrom: '' });
    // }
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              {t('documentSearch')}
            </Typography>
            <TextField
              id="txtOrderShipment"
              name="orderShipment"
              size="small"
              //   value={values.orderShipment}
              //   onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="เลขที่เอกสาร BR"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาที่สร้างรายการ
            </Typography>
            <BranchListDropDown
              sourceBranchCode={''}
              onChangeBranch={handleChangeBranch}
              isClear={clearBranchDropDown}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selOrderStatus"
                name="orderStatus"
                // value={values.orderStatus}
                // onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'ALL'}>ทั้งหมด</MenuItem>
                {/* {shipmentStatus.map((status) => (
                  <MenuItem
                    key={status.key}
                    value={status.key}
                  >
                    {status.text}
                  </MenuItem>
                ))} */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div">
              วันที่รับสินค้า
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div">
              ตั้งแต่ <span style={{ color: '#F54949' }}>*</span>
            </Typography>
            <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
              ถึง <span style={{ color: '#F54949' }}>*</span>
            </Typography>
            <DatePickerComponent onClickDate={handleEndDatePicker} value={endDate} type={'TO'} minDateTo={startDate} />
          </Grid>
        </Grid>

        <Grid item container xs={12} sx={{ mt: 3 }} justifyContent="flex-end" direction="row" alignItems="flex-end">
          <Button
            id="btnCreateStockTransferModal"
            variant="contained"
            //   onClick={handleOpenOrderReceiveModal}
            sx={{ minWidth: '15%' }}
            className={classes.MbtnClear}
            startIcon={<AddCircleOutlineOutlinedIcon />}
            color="secondary"
          >
            สร้างเอกสารใหม่
          </Button>
          <Button
            id="btnClear"
            variant="contained"
            //   onClick={onClickClearBtn}
            sx={{ width: '13%', ml: 2 }}
            className={classes.MbtnClear}
            color="cancelColor"
          >
            เคลียร์
          </Button>
          <Button
            id="btnSearch"
            variant="contained"
            color="primary"
            //   onClick={onClickValidateForm}
            sx={{ width: '13%', ml: 2 }}
            className={classes.MbtnSearch}
          >
            ค้นหา
          </Button>
        </Grid>
      </Box>
    </>
  );
}

export default PurchaseBranchRequest;
