import React from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { HighlightOff, CheckCircleOutline } from '@mui/icons-material';
import { useStyles } from '../../styles/makeTheme';

export interface OrderReceiveDetailProps {
  // sdNo: string;
  // shipmentNo: string;
  defaultOpen: boolean;
  onClickClose: any;
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

export default function OrderReceiveDetail({ defaultOpen, onClickClose }: OrderReceiveDetailProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(defaultOpen);

  const handleClose = () => {
    setOpen(false);
    onClickClose();
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>รับสินค้า</Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">-</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">-</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">วันที่:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">-</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">สถานะ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">-</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">ประเภท:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">-</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">สาขาต้นทาง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">-</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">สาขาปลายทาง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">-</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ marginTop: 4 }}>
            <Grid item container spacing={2} justifyContent="flex-end">
              <Button
                id="btnApprove"
                variant="contained"
                color="primary"
                className={classes.MbtnApprove}
                // onClick={handleApproveBtn}
                startIcon={<CheckCircleOutline />}
                sx={{ width: '15%' }}
              >
                ยืนยัน
              </Button>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
