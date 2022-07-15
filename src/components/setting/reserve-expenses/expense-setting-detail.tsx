import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import { useStyles } from '../../../styles/makeTheme';
import Save from '@mui/icons-material/Save';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

export default function ExpenseSettingDetail({ isOpen, onClickClose }: Props) {
  const classes = useStyles();

  const [values, setValues] = React.useState<any>({
    typeExpense: 'ALL',
  });
  return (
    <React.Fragment>
      <Dialog open={isOpen} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClickClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>รายละเอียดตั้งค่ารายการค่าใช้จ่าย</Typography>
        </BootstrapDialogTitle>
        <DialogContent sx={{ minHeight: '70vh' }}>
          <Grid
            container
            rowSpacing={5}
            columnSpacing={7}
            mb={2}
            pr={5}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="body2">สถานะ :</Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                  <FormControlLabel value="1" control={<Radio />} label="ใช้งาน" />
                  <FormControlLabel value="2" control={<Radio />} label="ไม่ใช้งาน" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                ประเภท<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id="selTypeExpense"
                  name="orderType"
                  value={values.typeExpense}
                  // onChange={handleChange}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value={'ALL'} selected={true}>
                    กรุณาเลือก
                  </MenuItem>
                  <MenuItem value={'0'}>ค่าใช้จ่ายร้านกาแฟ</MenuItem>
                  <MenuItem value={'1'}>ค่าใช้จ่ายหน้าร้าน</MenuItem>
                  <MenuItem value={'2'}>อื่นๆ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                ประเภทร้านที่แสดง<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id="selTypeExpense"
                  name="otherType"
                  // value={values.orderType}
                  // onChange={handleChange}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value={'ALL'} selected={true}>
                    กรุณาเลือก
                  </MenuItem>
                  <MenuItem value={'0'}>ค่าใช้จ่ายร้านกาแฟ</MenuItem>
                  <MenuItem value={'1'}>ค่าใช้จ่ายหน้าร้าน</MenuItem>
                  <MenuItem value={'2'}>อื่นๆ</MenuItem>
                </Select>
                <FormHelperText sx={{ textAlign: 'right' }}>เลือกได้มากกว่า 1 ประเภท</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" mt={5} mb={3}>
            รายการค่าใช้จ่าย
          </Typography>

          <Grid
            container
            rowSpacing={5}
            columnSpacing={7}
            mb={2}
            pr={5}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="body2">
                สินค้า<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                //   id="txt"
                name="status"
                size="small"
                //   value={values.orderShipment}
                //   onChange={handleChange}
                className={classes.MtextField}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                ชื่อบัญชี<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                helperText="Please enter your name"
                name="status"
                size="small"
                //   value={values.orderShipment}
                //   onChange={handleChange}
                className={classes.MtextField}
                fullWidth
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2">
                รหัสบัญชี<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                //   id="txt"
                name="status"
                size="small"
                //   value={values.orderShipment}
                //   onChange={handleChange}
                className={classes.MtextField}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">เอกสารที่ต้องส่ง :</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                helperText="Please enter your name"
                name="status"
                size="small"
                //   value={values.orderShipment}
                //   onChange={handleChange}
                className={classes.MtextField}
                fullWidth
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2">
                วงเงินอนุมัติ ผจก.ส่วน<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                //   id="txt"
                name="status"
                size="small"
                //   value={values.orderShipment}
                //   onChange={handleChange}
                className={classes.MtextField}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                วงเงินอนุมัติ ผจก.OCไม่เกิน<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="status"
                size="small"
                //   value={values.orderShipment}
                //   onChange={handleChange}
                className={classes.MtextField}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid
            item
            container
            xs={12}
            sx={{ mt: 5, pr: 5 }}
            justifyContent="flex-end"
            direction="row"
            alignItems="flex-end"
          >
            <Button
              variant="contained"
              //   onClick={handleOpenOrderReceiveModal}
              sx={{ minWidth: '12%' }}
              className={classes.MbtnSearch}
              color="warning"
              startIcon={<Save />}
            >
              บันทึก
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
