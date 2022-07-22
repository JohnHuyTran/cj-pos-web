import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SliderValueLabelUnstyled,
  TextField,
  Typography,
} from '@mui/material';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
import { useStyles } from '../../../styles/makeTheme';
import Save from '@mui/icons-material/Save';

import { expenseTypesSetting, getExpenseTypesSetting } from '../../../utils/enum/setting-reserve-expense-enum';

//component
import TexboxSearchSku from '../../commons/ui/texbox-search-sku';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
  type: string;
}

export default function ExpenseSettingDetail({ isOpen, onClickClose, type }: Props) {
  const classes = useStyles();

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

  const handleChangeProduct = (value: any) => {
    if (value) {
      setValues({ ...values, skuCode: value.skuCode });
    } else {
      setValues({ ...values, skuCode: '' });
    }
  };

  const validateForm = () => {
    console.log('values: ', values);

    console.log('approvalLimit1No: ', values.approvalLimit1);
    console.log('approvalLimit2No: ', values.approvalLimit2);
    console.log('approvalLimit1No-no: ', Number(values.approvalLimit1));
    console.log('approvalLimit2No-no: ', Number(values.approvalLimit2));
    if (
      values.type.length === 0 ||
      values.skuCode === '' ||
      values.accountNameTh === '' ||
      values.accountCode === '' ||
      values.approvalLimit1 === '' ||
      values.approvalLimit2 === ''
    ) {
      alert('validate 1');
    } else if (values.type === 'OTHER' && values.typeOther.length === 0) {
      alert('กรุณาเลือกประเภทร้านที่แสดง');
    } else if (Number(values.approvalLimit1) >= Number(values.approvalLimit2)) {
      alert('ต้องมีค่ามากกว่าผจก.ส่วน');
    } else {
      alert('pass');
    }
  };

  const handleAddButton = () => {
    validateForm();
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
    <React.Fragment>
      <Dialog open={isOpen} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleOnClose}>
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
            <Grid item xs={6}></Grid>
            <Grid item xs={2}>
              <Typography variant="body2" mb={2}>
                ประเภท<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth className={classes.Mselect} sx={{ mb: 3 }}>
                <Select
                  id="selType"
                  name="type"
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
              <Typography variant="body2" mb={2}>
                ประเภทร้านที่แสดง<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth className={classes.Mselect}>
                <Select
                  id="selTypeOther"
                  multiple
                  value={values.typeOther}
                  onChange={handleChangeMultiType}
                  displayEmpty
                  renderValue={
                    values.typeOther.length !== 0
                      ? (selected) => selected.map((v: any) => getExpenseTypesSetting(v)).join(', ')
                      : () => <div style={{ color: '#CBD4DB' }}>กรุณาเลือกประเภท</div>
                  }
                  disabled={values.type !== 'OTHER'}
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
            rowSpacing={5}
            columnSpacing={7}
            mb={2}
            pr={5}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="body2" mb={2}>
                สินค้า<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4} mb={3}>
              {/* <TextField
                //   id="txt"
                name="skuCode"
                size="small"
                value={values.skuCode}
                onChange={handleChange}
                className={classes.MtextField}
                fullWidth
              /> */}

              <TexboxSearchSku skuTypes="3,7" onSelectItem={handleChangeProduct} isClear={false} />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" mb={2}>
                ชื่อบัญชี<span style={{ color: '#F54949' }}>*</span> :
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
                  inputProps={{ maxLength: 50 }}
                />
                <FormHelperText sx={{ textAlign: 'right' }}>{values.accountNameTh.length}/50</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2" mb={2}>
                รหัสบัญชี<span style={{ color: '#F54949' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={4} mb={3}>
              <TextField
                //   id="txt"
                name="accountCode"
                size="small"
                type="number"
                value={values.accountCode}
                onChange={handleChange}
                className={classes.MtextField}
                fullWidth
              />
            </Grid>
            <Grid item xs={2} mb={2}>
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
                  inputProps={{ maxLength: 50 }}
                />
                <FormHelperText sx={{ textAlign: 'right' }}>{values.requiredDocumentTh.length}/50</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2">
                วงเงินอนุมัติ ผจก.ส่วน<span style={{ color: '#F54949' }}>*</span> :
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
              />
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">
                วงเงินอนุมัติ ผจก.OCไม่เกิน<span style={{ color: '#F54949' }}>*</span> :
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
              onClick={handleAddButton}
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
