import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export interface SimpleDialogProps {
  open: boolean;
  actionconfirm: string;
  onClose: (value: string) => void;
}

export default function DialogConfirm(props: SimpleDialogProps) {
  const { open, actionconfirm, onClose } = props;

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure {actionconfirm} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="inherit"
            onClick={() => handleListItemClick("CANCLE")}
          >
            CANCLE
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => handleListItemClick("OK")}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
