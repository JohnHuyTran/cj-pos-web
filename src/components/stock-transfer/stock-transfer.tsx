import moment from 'moment';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';
import DatePickerComponent from '../commons/ui/date-picker';
import { useStyles } from '../../styles/makeTheme';
import { Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ModalCreateStockTransfer from './create-stock-transfer';

interface State {
  paramQuery: string;
  piStatus: string;
  piType: string;
  dateFrom: string;
  dateTo: string;
}

export default function SupplierCheckOrderSearch() {
  const classes = useStyles();
  const [values, setValues] = React.useState<State>({
    paramQuery: '',
    piStatus: '0',
    piType: 'ALL',
    dateFrom: '',
    dateTo: '',
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };
  function handleCloseCreateModal() {
    setOpenCreateModal(false);
  }

  return (
    <>
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id="txtParamQuery"
              name="paramQuery"
              size="small"
              value={values.paramQuery}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="เลขที่เอกสาร BT"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาต้นทาง*
            </Typography>
            <TextField
              id="txtParamQuery"
              name="paramQuery"
              size="small"
              value=""
              className={classes.MtextField}
              fullWidth
              placeholder="ชื่อสาขา / รหัสสาขา"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาปลายทาง*
            </Typography>
            <TextField
              id="txtParamQuery"
              name="paramQuery"
              size="small"
              value=""
              className={classes.MtextField}
              fullWidth
              placeholder="ชื่อสาขา / รหัสสาขา"
            />
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div">
              วันที่รับสินค้า
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div">
              ตั้งแต่
            </Typography>
            <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
              ถึง
            </Typography>
            <DatePickerComponent onClickDate={handleEndDatePicker} value={endDate} type={'TO'} minDateTo={startDate} />
          </Grid>

          <Grid item xs={4} container>
            <Typography gutterBottom variant="subtitle1" component="div" sx={{ mt: 3.5 }}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selPiType"
                name="piType"
                value={values.piType}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'ALL'}>ทั้งหมด</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาเหตุการโอน
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selPiStatus"
                name="piStatus"
                value={values.piStatus}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={'0'}>กรุณาเลือก</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item container xs={12} sx={{ mt: 3 }} justifyContent="flex-end" direction="row" alignItems="flex-end">
            <Button
              id="btnCreateStockTransferModal"
              variant="contained"
              onClick={handleOpenCreateModal}
              sx={{ minWidth: '15%' }}
              className={classes.MbtnClear}
              startIcon={<AddCircleOutlineOutlinedIcon />}
              color="secondary"
            >
              สร้างรายการโอน
            </Button>
            <Button
              id="btnClear"
              variant="contained"
              // onClick={onClickClearBtn}
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
              // onClick={onClickValidateForm}
              sx={{ width: '13%', ml: 2 }}
              className={classes.MbtnSearch}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
        <hr />
      </Box>

      {openCreateModal && <ModalCreateStockTransfer isOpen={openCreateModal} onClickClose={handleCloseCreateModal} />}
    </>
  );
}
