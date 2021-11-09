import React, { ReactElement } from "react";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import theme from "../../../styles/theme";

interface Props {
  open: boolean;
  onClose: () => void;
  titleError: string;
  textError: string;
}

export default function AlertError({
  open,
  onClose,
  titleError,
  textError,
}: Props): ReactElement {
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
    >
      <DialogTitle>{titleError}</DialogTitle>
      <DialogContent>
        <DialogContentText>{textError}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id="btnClose"
          variant="contained"
          color="cancelColor"
          onClick={onClose}
        >
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
}
