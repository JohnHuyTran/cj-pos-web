import { useState, Fragment } from 'react';
import {
  Checkbox,
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
  CircularProgress
} from '@mui/material';
import { LoadingButton } from "@mui/lab";
import { Save } from '@mui/icons-material';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import { useStyles } from '../../../styles/makeTheme';

import { expenseTypesSetting, getExpenseTypesSetting } from '../../../utils/enum/setting-reserve-expense-enum';

//Components
import TexboxSearchSku from '../../commons/ui/texbox-search-sku';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
  type?: string;
}

export default function ExpenseSettingDetail({ isOpen, onClickClose, type }: Props) {
  const classes = useStyles();
  const [isOpenLoading, setIsOpenLoading] = useState(false)
  const [values, setValues] = useState<any>({
    isActive: 'true',
    type: [],
    typeOther: [],
    skuCode: '',
    accountNameTh: '',
    accountCode: '',
    requiredDocumentTh: '',
    approvalLimit1: '',
    approvalLimit2: '',
  });

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };

  const handleChangeMultiType = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, typeOther: value === 'string' ? value.split(',') : value });
  };

  const handleAddButton = () => {
    setIsOpenLoading(true)
    
    setTimeout(() => {
      setIsOpenLoading(false)
      console.log('values: ', values);
      onClickClose()
    }, 500)
  };

  const handleChangeProduct = (value: any) => {
    if (value) {
      setValues({ ...values, skuCode: value.skuCode });
    } else {
      setValues({ ...values, skuCode: '' });
    }
  };

  const handleOnClose = () => {
    onClickClose();
    setValues({
      isActive: 'true',
      type: [],
      typeOther: [],
      skuCode: '',
      accountNameTh: '',
      accountCode: '',
      requiredDocumentTh: '',
      approvalLimit1: '',
      approvalLimit2: '',
    });
  };

  return (
    <Fragment>
      <Dialog open={isOpen} maxWidth="lg" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" disabled={isOpenLoading} onClose={handleOnClose}>
          <Typography sx={{ ml:'15px', fontSize: 24, fontWeight: 400 }}>รายละเอียดตั้งค่ารายการค่าใช้จ่าย</Typography>
        </BootstrapDialogTitle>
        <DialogContent sx={{ p: '40px'}}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={7}
            mb={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="body2">สถานะ :</Typography>
            </Grid>
            <Grid item xs={10}>
              <FormControl disabled={isOpenLoading}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="isActive"
                  value={values.isActive}
                  onChange={handleChange}
                >
                  <FormControlLabel value="true" control={<Radio />} label="ใช้งาน" />
                  <FormControlLabel value="false" control={<Radio />} label="ไม่ใช้งาน" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                ประเภท<span style={{ color: '#F54949' }}> * </span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id="selType"
                  name="type"
                  disabled={isOpenLoading}
                  value={values.type}
                  onChange={handleChange}
                  displayEmpty
                  renderValue={
                    values.type.length !== 0
                      ? undefined
                      : () => <div style={{ color: '#CBD4DB' }}>กรุณาเลือกประเภท</div>
                  }
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {expenseTypesSetting.map((item, index: number) => (
                    <MenuItem key={index} value={item.key}>
                      {item.text}
                    </MenuItem>
                  ))}
                  <MenuItem value={'OTHER'}>อื่นๆ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                ประเภทร้านที่แสดง<span style={{ color: '#F54949' }}> * </span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id="selTypeOther"
                  multiple
                  disabled={isOpenLoading}
                  value={values.typeOther}
                  onChange={handleChangeMultiType}
                  displayEmpty
                  renderValue={
                    values.typeOther.length !== 0
                      ? (selected) => selected.map((v: any) => getExpenseTypesSetting(v)).join(', ')
                      : () => <div style={{ color: '#CBD4DB' }}>กรุณาเลือกประเภท</div>
                  }
                >
                  {expenseTypesSetting.map((item, index: number) => (
                    <MenuItem key={index} value={item.key}>
                      <Checkbox checked={values.typeOther.indexOf(item.key) > -1} />
                      {item.text}
                    </MenuItem>
                  ))}
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
            rowSpacing={1}
            columnSpacing={7}
            mb={2}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="body2">
                สินค้า<span style={{ color: '#F54949' }}> * </span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              {/* <TextField
                //   id="txt"
                name="skuCode"
                size="small"
                value={values.skuCode}
                onChange={handleChange}
                className={classes.MtextField}
                fullWidth
              /> */}

              <TexboxSearchSku skuTypes="3,7" onSelectItem={handleChangeProduct} disabled={isOpenLoading} isClear={false} />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                ชื่อบัญชี<span style={{ color: '#F54949' }}> * </span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  name="accountNameTh"
                  size="small"
                  value={values.accountNameTh}
                  onChange={handleChange}
                  className={classes.MtextField}
                  fullWidth
                  disabled={isOpenLoading}
                  inputProps={{ maxLength: 50 }}
                />
                <FormHelperText sx={{ textAlign: 'right' }}>{values.accountNameTh.length}/50</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2">
                รหัสบัญชี<span style={{ color: '#F54949' }}> * </span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                //   id="txt"
                name="accountCode"
                size="small"
                type="number"
                value={values.accountCode}
                onChange={handleChange}
                className={classes.MtextField}
                fullWidth
                disabled={isOpenLoading}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">เอกสารที่ต้องส่ง :</Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  name="requiredDocumentTh"
                  size="small"
                  value={values.requiredDocumentTh}
                  onChange={handleChange}
                  className={classes.MtextField}
                  fullWidth
                  disabled={isOpenLoading}
                  inputProps={{ maxLength: 50 }}
                />
                <FormHelperText sx={{ textAlign: 'right' }}>{values.requiredDocumentTh.length}/50</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2">
                วงเงินอนุมัติ ผจก.ส่วน<span style={{ color: '#F54949' }}> * </span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                //   id="txt"
                name="approvalLimit1"
                size="small"
                type="number"
                value={values.approvalLimit1}
                onChange={handleChange}
                className={classes.MtextField}
                fullWidth
                placeholder="0.00"
                disabled={isOpenLoading}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                วงเงินอนุมัติ ผจก.OCไม่เกิน<span style={{ color: '#F54949' }}> * </span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="approvalLimit2"
                size="small"
                type="number"
                value={values.approvalLimit2}
                onChange={handleChange}
                className={classes.MtextField}
                fullWidth
                placeholder="0.00"
                disabled={isOpenLoading}
              />
            </Grid>
          </Grid>

          <Grid item container xs={12} sx={{ mt: 5, justifyContent: 'right'}}>
            <LoadingButton
              id='btnSave'
              variant='contained'
              color='warning'
              startIcon={<Save />}
              loading={isOpenLoading}
              loadingIndicator={
                <Typography component='span' sx={{ fontSize: '11px' }}>
                  กรุณารอสักครู่ <CircularProgress color='inherit' size={15} />
                </Typography>
              }
              sx={{ borderRadius: 2, width: '12%', height: 43 }}
              onClick={handleAddButton}>
              บันทึก
            </LoadingButton>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
