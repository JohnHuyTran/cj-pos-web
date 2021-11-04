import React, { ReactElement } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {
  Entry,
  OrderApproveCloseJobRequest,
  ShipmentRequest,
} from "../../models/order-model";
import {
  approveOrderShipments,
  closeOrderShipments,
} from "../../services/order-shipment";
import { ShipmentDeliveryStatusCodeEnum } from "../../utils/enum/check-order-enum";
import DataDiffInfo from "./table-diff-info";
import { ApiError } from "../../models/api-error-model";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { featchOrderListAsync } from "../../store/slices/check-order-slice";
import LoadingModal from "../commons/ui/loading-modal";

interface Confirm {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface loadingModalState {
  open: boolean;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
}

export default function ConfirmCloseModel(props: Confirm) {
  const { open, onClose, onConfirm } = props;

  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });

  const handleClose = () => {
    onClose();
  };

  const confirmApproveBtn = () => {
    onConfirm();
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "#263238" }}
            width={350}
          >
            <Typography variant="body1" align="center">
              ข้อมูลที่แก้ไขยังไม่ได้รับการบันทึก <br />{" "}
              ต้องการออกจากหน้าจอนี้หรือไม่
            </Typography>
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
          <Button
            id="btnCancel"
            variant="contained"
            size="small"
            color="cancelColor"
            sx={{ borderRadius: 2, width: 80, mr: 2 }}
            onClick={handleClose}
          >
            ยกเลิก
          </Button>
          <Button
            id="btnConfirm"
            variant="contained"
            size="small"
            color="primary"
            sx={{ borderRadius: 2, width: 80 }}
            onClick={confirmApproveBtn}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
