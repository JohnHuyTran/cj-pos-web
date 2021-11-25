import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import React, { ReactElement } from "react";
import { ApiError } from "../../models/api-error-model";
import { GenerateBORequest } from "../../models/order-model";
import { SavePurchaseRequest } from "../../models/supplier-check-order-model";
import { generateBO } from "../../services/order-shipment";
import { approveSupplierOrder } from "../../services/purchase";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdateAction: (value: boolean, errorMsg: any) => void;
  piNo: string;
  docNo: string;
  billNo: string;
  comment: string;
  items: any;
}

export default function ModelConfirm({
  open,
  onClose,
  onUpdateAction,
  piNo,
  docNo,
  billNo,
  comment,
  items,
}: Props): ReactElement {
  const handleConfirm = async () => {
    // const payload: GenerateBORequest = {
    //   comment: comment,
    // };
    // generateBO(shipmentNo, payload).then(
    //   function (value) {
    //     setTimeout(() => {
    //       onUpdateAction(true, "");
    //     }, 3000);
    //   },
    //   function (error: ApiError) {
    //     onUpdateAction(false, error.message);
    //   }
    // );

    const payloadSave: SavePurchaseRequest = {
      billNo: billNo,
      comment: comment,
      items: items,
    };

    await approveSupplierOrder(payloadSave, piNo).then(
      function (value) {
        setTimeout(() => {
          onUpdateAction(true, "");
        }, 3000);
      },
      function (error: ApiError) {
        onUpdateAction(false, error.message);
      }
    );
    onClose();
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      sx={{ minWidth: 500 }}
    >
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "#263238" }}
        >
          <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
            ยืนยันการตรวจสอบผลต่าง (DC)
          </Typography>
          <Typography variant="body1" align="center">
            เลขที่ใบสั่งซื้อ PO <label style={{ color: "#AEAEAE" }}>|</label>{" "}
            <label style={{ color: "#36C690" }}>
              <b>{docNo}</b>
            </label>
          </Typography>

          <Typography variant="body1" align="center">
            เลขที่บิลผู้จำหน่าย <label style={{ color: "#AEAEAE" }}>|</label>{" "}
            <label style={{ color: "#36C690" }}>
              <b>{billNo}</b>
            </label>
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
        <Button
          id="btnCancle"
          variant="contained"
          color="cancelColor"
          sx={{ borderRadius: 2, width: 80, mr: 2 }}
          onClick={onClose}
        >
          ยกเลิก
        </Button>
        <Button
          id="btnConfirm"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, width: 80 }}
          onClick={handleConfirm}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
