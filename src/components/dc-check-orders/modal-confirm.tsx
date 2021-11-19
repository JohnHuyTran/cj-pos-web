import React, { ReactElement } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { ApiError } from "../../models/api-error-model";
import { GenerateBORequest } from "../../models/order-model";
import {
  approveDCOrderShipments,
  generateBO,
} from "../../services/order-shipment";
import { DCOrderApproveRequest } from "../../models/dc-check-order-model";
import LoadingModal from "../commons/ui/loading-modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdateAction: (value: boolean, errorMsg: any) => void;
  idDC: string;
  shipmentNo: string;
  sdNo: string;
  comment: string;
}
interface loadingModalState {
  open: boolean;
}

export default function ModelConfirm({
  open,
  onClose,
  onUpdateAction,
  idDC,
  shipmentNo,
  sdNo,
  comment,
}: Props): ReactElement {
  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleConfirm = async () => {
    handleOpenLoading("open", true);
    const payload: GenerateBORequest = {
      comment: comment,
    };
    await approveDCOrderShipments(idDC, payload)
      .then
      // function (value) {
      //   setTimeout(() => {
      //     onUpdateAction(true, "");
      //   }, 3000);
      // },
      // function (error: ApiError) {
      //   onUpdateAction(false, error.message);
      // }
      ();
    handleOpenLoading("open", false);
    onClose();
  };

  // const handleConfirm = async () => {
  //   handleOpenLoading("open", true);
  //   const payload: DCOrderApproveRequest = {
  //     dcComment: comment,
  //   };

  //   await approveDCOrderShipments(sdNo, payload).then(
  //     async function (value) {
  //       // await updateShipmentOrder();
  //       // setTimeout(() => {
  //       // onUpdateShipmentStatus(true, "");
  //       onClose();
  //       // }, 3000);
  //     },
  //     function (error: ApiError) {
  //       // onUpdateShipmentStatus(false, error.message);
  //       onClose();
  //     }
  //   );
  //   handleOpenLoading("open", false);
  // };

  return (
    <div>
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
              เลขที่เอกสาร LD <label style={{ color: "#AEAEAE" }}>|</label>{" "}
              <label style={{ color: "#36C690" }}>
                <b>{shipmentNo}</b>
              </label>
            </Typography>

            <Typography variant="body1" align="center">
              เลขที่เอกสาร SD <label style={{ color: "#AEAEAE" }}>|</label>{" "}
              <label style={{ color: "#36C690" }}>
                <b>{sdNo}</b>
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

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}
