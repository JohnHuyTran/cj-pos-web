import React from "react";
import { Box, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

export default function DialogConfirm(props: SimpleDialogProps) {
  const { open, onClose } = props;

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Are you sure delete ?</DialogTitle>

        <Box mt={5}>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Button
                variant="contained"
                size="large"
                color="inherit"
                onClick={() => handleListItemClick("CANCLE")}
              >
                CANCLE
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => handleListItemClick("OK")}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}
