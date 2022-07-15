import { Fragment, ReactElement } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  CircularProgress } from '@mui/material'
  interface ModalSettingExpenseProps {
    open: boolean;
  }

export default function ModalSettingExpense({
  open
}: ModalSettingExpenseProps): ReactElement {
  return(
    <Fragment>
      <Dialog open={open} maxWidth="xs" fullWidth={true} key="modal-select-period"
      // id="ModalConfirmExpense"
      // open={open}
      // aria-labelledby="alert-dialog-title"
      // aria-describedby="alert-dialog-description"
      // maxWidth="lg"
      // PaperProps={{ sx: { minWidth: 450, minHeight: 241 } }}
      >
        <DialogContent></DialogContent>
      </Dialog>
    </Fragment>
  )
}