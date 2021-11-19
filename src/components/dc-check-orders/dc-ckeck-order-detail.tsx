import React, { ReactElement, useEffect } from "react";

import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";

import { BootstrapDialogTitle } from "../commons/ui/dialog-title";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import ModalShowPDF from "../check-orders/modal-show-pdf";
import { getPathReportSD } from "../../services/order-shipment";
import { TextareaAutosize, TextField } from "@mui/material";
import ModelConfirm from "./modal-confirm";
import SnackbarStatus from "../commons/ui/snackbar-status";
import { ContentPaste } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { featchorderDetailDCAsync } from "../../store/slices/dc-check-order-detail-slice";
import { getDCStatus, getSdType } from "../../utils/utils";

import DCOrderDetailList from "./dc-check-order-detail-list";
import { convertUtcToBkkDate } from "../../utils/date-utill";
import ModalShowFile from "./modal-show-file";
import ModalShowImage from "./modal-show-image";

interface Props {
  isOpen: boolean;
  // sdNo: string;
  // shipmentNo: string;
  idDC: string;
  onClickClose: () => void;
}

interface State {
  commentDC: string;
}

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  isSuccess: boolean;
  contentMsg: string;
}

function DCOrderDetail({
  isOpen,
  // sdNo,
  // shipmentNo,
  idDC,
  onClickClose,
}: Props): ReactElement {
  const orderDetailList = useAppSelector(
    (state) => state.dcCheckOrderDetail.orderDetail
  );

  const [values, setValues] = React.useState<State>({
    commentDC: "",
  });

  const [sdNo, setSdNo] = React.useState("");
  const [shipmentNo, setShipmentNo] = React.useState("");
  const [verifyDCStatus, setverifyDCStatus] = React.useState("");
  const [dcSdType, setDCSdType] = React.useState("");
  const [imageFile, setImageFile] = React.useState("");

  const [isDisplayActBtn, setIsDisplayActBtn] = React.useState("");
  const [open, setOpen] = React.useState(isOpen);
  const [openModelPreviewDocument, setOpenModelPreviewDocument] =
    React.useState(false);
  const [openModelConfirm, setOpenModelConfirm] = React.useState(false);

  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [contentMsg, setContentMsg] = React.useState("");
  const [generateBOStatus, setGenerateBOStatus] = React.useState(false);

  const [characterCount, setCharacterCount] = React.useState(0);

  useEffect(() => {
    console.log("dc open", open);
    setOpen(isOpen);

    // setverifyDCStatus(getDCStatus(detailDC.verifyDCStatus));
    // setDCSdType(getSdType(detailDC.sdType));
  }, [open]);

  const detailDC: any = orderDetailList.data ? orderDetailList.data : null;
  const detailDCItems = detailDC.items ? detailDC.items : [];

  console.log("shipmentNo : " + JSON.stringify(detailDC.shipmentNo));
  console.log("sdNo : " + JSON.stringify(detailDC.sdNo));
  console.log("sdImageFile : " + JSON.stringify(detailDC.sdImageFile));

  console.log("detailDCItems : " + JSON.stringify(detailDCItems));
  // if (detailDC !== null) {
  // setShipmentNo(detailDC.shipmentNo);
  // setSdNo(detailDC.sdNo);
  // }

  const handleChangeCommentDC = (event: any) => {
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= 100) {
      setCharacterCount(event.target.value.length);
      setValues({ ...values, [event.target.name]: value });
    }
  };

  const handlCheckedButton = () => {
    setOpenModelConfirm(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLinkDocument = () => {
    setOpenModelPreviewDocument(true);
  };

  const handleModelPreviewDocument = () => {
    setOpenModelPreviewDocument(false);
  };

  const handleModelConfirm = () => {
    setOpenModelConfirm(false);
  };

  const handleGenerateBOStatus = (issuccess: boolean, errorMsg: string) => {
    const msg = issuccess ? "This transaction is success aaa" : errorMsg;
    setShowSnackBar(true);
    setContentMsg(msg);
    setGenerateBOStatus(issuccess);
    // setSnackbarValue({ ...snackbarValue, open: true, onClose: handleCloseSnackBar, isSuccess: issuccess, contentMsg: msg });
  };

  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={onClickClose}
        >
          <Typography variant="h5">ตรวจสอบผลต่าง (DC)</Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร LD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{detailDC.shipmentNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">สถานะการตรวจสอบผลต่าง:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {getDCStatus(detailDC.verifyDCStatus)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร SD:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">{detailDC.sdNo}</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">ประเภท:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {getSdType(detailDC.sdType)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">วันที่:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">
                  {convertUtcToBkkDate(detailDC.receivedDate)}
                </Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">แนบภาพสินค้า/วีดีโอ:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleLinkDocument}
                >
                  ดูเอกสาร
                </Link>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">หมายเหตุ DC:</Typography>
              </Grid>
              <Grid item lg={4} mt={0.5}>
                <TextareaAutosize
                  // aria-label="empty textarea"
                  id="txarCommentDC"
                  name="commentDC"
                  minRows={3}
                  placeholder="กรุณากรอก หมายเหตุ"
                  onChange={handleChangeCommentDC}
                  value={values.commentDC}
                  style={{
                    width: "100%",
                    maxWidth: 300,
                    borderRadius: "5px",
                    border: "1px solid #AEAEAE",
                    fontFamily: "Kanit",
                    padding: "5px",
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    color: "#AEAEAE",
                    width: "100%",
                    maxWidth: 300,
                    textAlign: "right",
                  }}
                >
                  {characterCount}/100
                </div>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">
                  แนบเอกสารใบส่วนต่าง
                  <br />
                  หลังเซ็นต์:
                </Typography>
              </Grid>
              <Grid item lg={4}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleLinkDocument}
                >
                  ดูเอกสาร
                </Link>
              </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="right" sx={{ mt: 1 }}>
              <Grid item>
                <Box sx={{ display: isDisplayActBtn }}>
                  <Button
                    id="btnChecked"
                    variant="contained"
                    color="primary"
                    startIcon={<ContentPaste />}
                    onClick={handlCheckedButton}
                    sx={{
                      borderRadius: "5px",
                      width: "200px",
                      padding: "8px",
                    }}
                  >
                    ตรวจสอบแล้ว
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {detailDCItems !== [] && <DCOrderDetailList items={detailDCItems} />}
        </DialogContent>
      </Dialog>

      <ModelConfirm
        open={openModelConfirm}
        onClose={handleModelConfirm}
        onUpdateAction={handleGenerateBOStatus}
        idDC={idDC}
        sdNo={detailDC.sdNo}
        shipmentNo={detailDC.shipmentNo}
        comment={values.commentDC}
      />

      {/* <ModalShowPDF
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        url={getPathReportSD("")}
      /> */}

      <SnackbarStatus
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        isSuccess={generateBOStatus}
        contentMsg={contentMsg}
      />

      {/* <ModalShowFile
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        file={detailDC.sdImageFile}
      /> */}

      <ModalShowImage
        open={openModelPreviewDocument}
        onClose={handleModelPreviewDocument}
        file={detailDC.sdImageFile}
      />
    </div>
  );
}

export default DCOrderDetail;
