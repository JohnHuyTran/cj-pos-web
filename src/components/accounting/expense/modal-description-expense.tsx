import { InfoRounded } from '@mui/icons-material';
import { Dialog, DialogContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { ExpenseInfo } from '../../../models/branch-accounting-model';
import { BootstrapDialogTitle } from '../../commons/ui/dialog-title';
interface Props {
  open: boolean;
  onClickClose: () => void;
  info: ExpenseInfo[];
}
function ModelDescriptionExpense({ open, onClickClose, info }: Props) {
  return (
    <Dialog open={open} maxWidth='xs' fullWidth={true}>
      <DialogContent>
        <BootstrapDialogTitle id='dialog-title' onClose={onClickClose}>
          <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
            รายการเอกสารแนบ
          </Typography>

          {info
            .filter((i: ExpenseInfo) => i.active)
            .map((i: ExpenseInfo, index: number) => {
              return (
                <Typography variant='body2' key={index}>
                  {i.accountName} :{i.requiredDocument}
                </Typography>
              );
            })}
        </BootstrapDialogTitle>
      </DialogContent>
    </Dialog>
  );
}

export default ModelDescriptionExpense;
