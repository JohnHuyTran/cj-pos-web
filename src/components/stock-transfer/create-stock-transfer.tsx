import React, { ReactElement, useEffect } from 'react';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { DialogTitle, IconButton } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import Steppers from './steppers';

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

function SupplierOrderDetail({ isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const [status, setStatus] = React.useState(0);

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [open]);

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: '1em' }}>สร้างรายการโอนสินค้า</Typography>
          <Steppers status={status}></Steppers>
        </BootstrapDialogTitle>

        <DialogContent>
          <h1>xxxx</h1>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupplierOrderDetail;
