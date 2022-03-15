import React, { ReactElement, useEffect } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { useStyles } from '../../styles/makeTheme';
import { HighlightOff } from '@mui/icons-material';
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
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <Dialog open={open} maxWidth="xl" fullWidth={true}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Typography sx={{ fontSize: '1em' }}>รายละเอียดข้อมูลลูกค้า</Typography>
      </BootstrapDialogTitle>

      <DialogContent>
        <Box pl={2} pr={2}>
          <Grid container spacing={1} mb={2}>
            <Grid item xs={2} mb={2}>
              <Typography gutterBottom variant="subtitle1" component="div">
                เลขที่ใบเสร็จ/ใบกำกับ :
              </Typography>
            </Grid>
            <Grid item xs={10} mb={2}>
              <Typography gutterBottom variant="subtitle1" component="div">
                S222222222-222222
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: '1em', fontWeight: 600 }}>ข้อมูลลูกค้า</Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                เลขที่สมาชิก :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtFirstName"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอก"
                {...register('firstName')}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                เลขประจำตัวผู้เสียภาษี :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtLastName"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอก"
                {...register('lastName', { required: true })}
              />
              {errors.lastName && (
                <FormHelperText id="component-helper-text">Some important helper text</FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>

            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                ชื่อ / ชื่อบริษัท :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtFirstName"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอก"
                {...register('firstName')}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
                นามสกุล :
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="txtLastName"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอก"
                {...register('lastName', { required: true })}
              />
              {errors.lastName && (
                <FormHelperText id="component-helper-text">Some important helper text</FormHelperText>
              )}
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </Box>

        {/* <Grid container spacing={2} mt={4} mb={2}>
            <Grid item xs={6}>
              <TextField
                id="txtAge"
                size="small"
                className={classes.MtextField}
                fullWidth
                placeholder="กรุณากรอก"
                {...register('age', { pattern: /\d+/ })}
              />
              {errors.age && <FormHelperText id="component-helper-text">Please enter number for age.</FormHelperText>}
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid> */}

        <Box pl={2} pr={2}>
          <Grid container spacing={1} mt={4}>
            <Grid item xs={2} mb={2}>
              <Button
                id="btnCreateStockTransferModal"
                variant="contained"
                // onClick={handleOpenCreateModal}
                // sx={{ width: 150, display: `${displayBtnCreate ? 'none' : ''}` }}
                sx={{ width: 200 }}
                className={classes.MbtnClear}
                // startIcon={<AddCircleOutlineOutlinedIcon />}
                color="primary"
              >
                Preview ใบเสร็จ / ใบกำกับ
              </Button>
            </Grid>
            <Grid item xs={10} sx={{ textAlign: 'end' }}>
              <Button
                id="btnClear"
                variant="contained"
                // onClick={onClickClearBtn}
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
                onClick={handleSubmit(onSubmit)}
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
