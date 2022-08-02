import { Dialog, DialogContent } from '@mui/material';
import { BootstrapDialogTitle } from 'components/commons/ui/dialog-title';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ModalDetailCash({ isOpen, onClose }: Props) {
  return (
    <React.Fragment>
      <Dialog open={isOpen} maxWidth='xl' fullWidth={true}>
        <BootstrapDialogTitle id='customized-dialog-title' onClose={onClose}></BootstrapDialogTitle>
        <DialogContent sx={{ minHeight: '70vh' }}></DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default ModalDetailCash;
