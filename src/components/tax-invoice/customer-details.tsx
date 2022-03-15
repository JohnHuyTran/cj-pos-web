import React, { ReactElement, useEffect } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { useStyles } from '../../styles/makeTheme';
import { ContentPaste, HighlightOff, Save, Sync } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { Box, Button, DialogTitle, FormHelperText, Grid, IconButton, TextField } from '@mui/material';

import { useForm } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}
        >
          <HighlightOff fontSize="large" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function customerDetails({ isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const classes = useStyles();

  const [disabledBtnPreview, setDisabledBtnPreview] = React.useState(true);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSave = (data: any) => {
    if (data) {
      setDisabledBtnPreview(false);
      console.log('data: ', data);
    }
  };

  const handleClear = () => {
    reset({
      taxIdenNo: '',
      name: '',
      lastName: '',
      number: '',
      building: '',
      group: '',
      province: '',
      district: '',
      subDistrict: '',
      postcode: '',
    });
  };

  return (
    <Dialog open={open} maxWidth="xl" fullWidth={true}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Typography sx={{ fontSize: '1em' }}>รายละเอียดข้อมูลลูกค้า</Typography>
      </BootstrapDialogTitle>

      <DialogContent>
        <Box pl={2} pr={2}>
          <Grid container spacing={1}>
            <Grid item xs={2} mb={3}>
              <Typography gutterBottom variant="subtitle1" component="div">
                เลขที่ใบเสร็จ/ใบกำกับ :
              </Typography>
            </Grid>
            <Grid item xs={10} mb={2}>
              <Typography gutterBottom variant="subtitle1" component="div">
                S222222222-222222
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1} mb={2}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '1em', fontWeight: 600 }}>ข้อมูลลูกค้า</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                เลขที่สมาชิก :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtMemberId"
                size="small"
                className={classes.MtextField}
                fullWidth
                value="1234567890"
                sx={{ backgroundColor: '#E5E5E5' }}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                เลขประจำตัวผู้เสียภาษี<span style={{ color: '#FF0000' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtTaxIdenNo"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกเลขประจำตัวผู้เสียภาษี"
                {...register('taxIdenNo', { required: true })}
              />
              {errors.taxIdenNo && (
                <FormHelperText id="component-helper-text" style={{ color: '#FF0000', textAlign: 'right' }}>
                  กรุณากรอกรายละเอียด
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                ชื่อ / ชื่อบริษัท<span style={{ color: '#FF0000' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtName"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกชื่อ / ชื่อบริษัท"
                {...register('name', { required: true })}
              />
              {errors.name && (
                <FormHelperText id="component-helper-text" style={{ color: '#FF0000', textAlign: 'right' }}>
                  กรุณากรอกรายละเอียด
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                นามสกุล :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtLastName"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกนามสกุล"
                {...register('lastName')}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>

          <Grid container spacing={1} mb={2}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '1em', fontWeight: 600 }}>ที่อยู่</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                เลขที่<span style={{ color: '#FF0000' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtNumber"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกเลขที่"
                {...register('number', { required: true })}
              />

              {errors.number && (
                <FormHelperText id="component-helper-text" style={{ color: '#FF0000', textAlign: 'right' }}>
                  กรุณากรอกรายละเอียด
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                อาคาร :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtBuilding"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกเลขอาคาร"
                {...register('building')}
              />
            </Grid>
            <Grid item xs={1}></Grid>

            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                หมู่ :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtGroup"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกหมู่"
                {...register('group')}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                จังหวัด<span style={{ color: '#FF0000' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtProvince"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกจังหวัด"
                {...register('province', { required: true })}
              />
              {errors.province && (
                <FormHelperText id="component-helper-text" style={{ color: '#FF0000', textAlign: 'right' }}>
                  กรุณากรอกรายละเอียด
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>

            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                เขต / อำเภอ<span style={{ color: '#FF0000' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtDistrict"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกเขต / อำเภอ"
                {...register('district', { required: true })}
              />
              {errors.district && (
                <FormHelperText id="component-helper-text" style={{ color: '#FF0000', textAlign: 'right' }}>
                  กรุณากรอกรายละเอียด
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                แขวง / ตำบล<span style={{ color: '#FF0000' }}>*</span> :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtsubDistrict"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกแขวง / ตำบล"
                {...register('subDistrict', { required: true })}
              />
              {errors.subDistrict && (
                <FormHelperText id="component-helper-text" style={{ color: '#FF0000', textAlign: 'right' }}>
                  กรุณากรอกรายละเอียด
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>

            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={2}>
                รหัสไปรษณีย์ :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtpostCode"
                size="small"
                type="number"
                inputProps={{ maxLength: 5 }}
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอกรหัสไปรษณีย์"
                {...register('postcode', { pattern: /\d+/ })}
              />
              {errors.postcode && (
                <FormHelperText id="component-helper-text" style={{ color: '#FF0000', textAlign: 'right' }}>
                  กรุณากรอกตัวเลข
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={7}></Grid>
          </Grid>
        </Box>

        <Box pl={2} pr={2}>
          <Grid container spacing={1} mt={4}>
            <Grid item xs={2} mb={2}>
              <Button
                id="btnCreateStockTransferModal"
                variant="contained"
                // onClick={handleOpenCreateModal}
                // sx={{ width: 150, display: `${displayBtnPreview ? 'none' : ''}` }}
                sx={{ width: 220 }}
                className={classes.MbtnClear}
                startIcon={<ContentPaste />}
                color="primary"
                disabled={disabledBtnPreview}
              >
                Preview ใบเสร็จ / ใบกำกับ
              </Button>
            </Grid>
            <Grid item xs={10} sx={{ textAlign: 'end' }}>
              <Button
                id="btnClear"
                variant="contained"
                startIcon={<Sync />}
                onClick={handleClear}
                sx={{ width: 110, ml: 2 }}
                className={classes.MbtnClear}
                color="cancelColor"
              >
                เคลียร์
              </Button>

              <Button
                id="btnSearch"
                variant="contained"
                color="warning"
                startIcon={<Save />}
                onClick={handleSubmit(onSave)}
                sx={{ width: 110, ml: 2 }}
                className={classes.MbtnSave}
              >
                บันทึก
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default customerDetails;
