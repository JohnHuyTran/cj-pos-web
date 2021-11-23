import React, { ReactElement, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import {
  Button,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { CheckCircleOutline, HighlightOff } from "@mui/icons-material";
import { Box } from "@mui/system";
import Steppers from "../commons/ui/steppers";
import SaveIcon from "@mui/icons-material/Save";
import { useStyles } from "../../styles/makeTheme";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

interface Props {
  isOpen: boolean;
  supplierId: string;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}
        >
          <HighlightOff fontSize="large" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const columns: GridColDef[] = [
  {
    field: "rowId",
    headerName: "ลำดับ",
    width: 80,
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "barCode",
    headerName: "บาร์โค้ด",
    minWidth: 150,
    headerAlign: "center",
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "productName",
    headerName: "สินค้า",
    headerAlign: "center",
    // minWidth: 250,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <div>
        <Typography variant="body2">{params.value}</Typography>
        <Typography color="textSecondary" variant="body2">
          {params.getValue(params.id, "skuCode") || ""}
        </Typography>
      </div>
    ),
  },
  {
    field: "unitName",
    headerName: "หน่วย",
    width: 90,
    headerAlign: "center",
    sortable: false,
  },
  {
    field: "qty",
    headerName: "จำนวนที่สั่ง",
    width: 110,
    headerAlign: "center",
    align: "right",
    sortable: false,
  },
  {
    field: "actualQty",
    headerName: "จำนวนที่รับ",
    width: 110,
    headerAlign: "center",
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <TextField
        variant="outlined"
        name="txnQuantityActual"
        type="number"
        inputProps={{ style: { textAlign: "right" } }}
        value={params.value}
        onChange={(e) => {
          var value = e.target.value ? parseInt(e.target.value, 10) : "";
          if (value < 0) value = 0;

          params.api.updateRows([
            { ...params.row, productQuantityActual: value },
          ]);
        }}
        // onBlur={(e) => {
        //   isAllowActualQty(params, parseInt(e.target.value, 10));

        //   params.api.updateRows([
        //     { ...params.row, productQuantityActual: e.target.value },
        //   ]);
        // }}
        // disabled={isDisable(params) ? true : false}
        // autoComplete="off"
      />
    ),
  },
  {
    field: "setPrice",
    headerName: "ราคาต่อหน่วย",
    width: 135,
    headerAlign: "center",
    align: "right",
    sortable: false,
  },
  {
    field: "salePrice",
    headerName: "ลด/ชาร์ท",
    width: 135,
    headerAlign: "center",
    align: "right",
    sortable: false,
  },
  {
    field: "sumPrice",
    headerName: "รวม",
    width: 120,
    headerAlign: "center",
    align: "right",
    sortable: false,
  },
];

function SupplierOrderDetail({
  isOpen,
  supplierId,
  onClickClose,
}: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const handleClose = () => {
    setOpen(false);
    onClickClose();
  };
  useEffect(() => {
    console.log("dc open", open);
    setOpen(isOpen);
    // setValueCommentDC(detailDC.dcComment);
  }, [open]);

  const classes = useStyles();

  const [pageSize, setPageSize] = React.useState<number>(10);

  const rows = [
    {
      // rowOrder: index + 1,
      // id: `${item.deliveryOrderNo}${item.barcode}_${index}`,
      rowId: 1,
      id: ``,
      seqItem: 1,
      produtStatus: 1,
      isControlStock: 1,
      isAllowDiscount: 1,
      skuCode: "000000000020004592",
      barCode: "8852966000097",
      productName: "00010/อัลเฟรโดพิซซ่าซีฟู้ด100g",
      unitCode: "ST",
      unitName: "ชิ้น",
      qty: 12,
      qtyAll: 0,
      controlPrice: 0,
      salePrice: 27.34,
      setPrice: 27.34,
      sumPrice: 328.08,
      actualQty: 0,
      actualQtyAll: 0,
    },
  ];

  const [valueCommentDC, setValueCommentDC] = React.useState("");
  const [characterCount, setCharacterCount] = React.useState(0);
  const [errorCommentDC, setErrorCommentDC] = React.useState(false);

  const maxCommentLength = 255;
  const handleChangeCommentDC = (event: any) => {
    const value = event.target.value;
    const length = event.target.value.length;
    if (length <= maxCommentLength) {
      setCharacterCount(event.target.value.length);
      setValueCommentDC(value);
    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography variant="h5">รายละเอียด อ้างอิง SD โอนลอย</Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <Steppers></Steppers>
          <Box mt={4} sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่ใบสั่งซื้อ PO:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">xxxx</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่บิลผู้จำหน่าย:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">xxx</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">เลขที่เอกสาร PI:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">xxxx</Typography>
              </Grid>
              <Grid item lg={2}>
                <Typography variant="body2">แนบเอกสารจากผู้ขาย:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">xxx</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={2}>
                <Typography variant="body2">รหัสผู้จัดจำหน่าย:</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="body2">xxxx</Typography>
              </Grid>
              <Grid item lg={6}></Grid>
            </Grid>
          </Box>

          <Grid
            item
            container
            xs={12}
            sx={{ mt: 3 }}
            justifyContent="flex-end"
            direction="row"
            alignItems="flex-end"
          >
            <Button
              id="btnSave"
              variant="contained"
              color="warning"
              className={classes.MbtnSave}
              // onClick={handleSaveButton}
              startIcon={<SaveIcon />}
            >
              บันทึก
            </Button>
            <Button
              id="btnApprove"
              variant="contained"
              color="primary"
              className={classes.MbtnApprove}
              // onClick={handleApproveBtn}
              startIcon={<CheckCircleOutline />}
            >
              อนุมัติ
            </Button>
          </Grid>

          <Box mt={2} bgcolor="background.paper">
            <div style={{ width: "100%" }} className={classes.MdataGrid}>
              <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pagination
                autoHeight
              />
            </div>
          </Box>

          <Box mt={3}>
            <Grid container spacing={2} mb={1}>
              <Grid item lg={4}>
                <Typography variant="body2">หมายเหตุ:</Typography>

                <TextField
                  multiline
                  fullWidth
                  rows={6}
                  onChange={handleChangeCommentDC}
                  defaultValue={valueCommentDC}
                  placeholder="กรุณากรอก หมายเหตุ"
                  className={classes.MtextFieldRemark}
                  inputProps={{ maxLength: maxCommentLength }}
                  error={errorCommentDC === true}
                  helperText={
                    errorCommentDC === true ? "กรุณากรอก หมายเหตุ" : " "
                  }
                  sx={{ maxWidth: 350 }}
                  // disabled={detailDC.verifyDCStatus !== 0}
                />

                <div
                  style={{
                    fontSize: "11px",
                    color: "#AEAEAE",
                    width: "100%",
                    maxWidth: 350,
                    textAlign: "right",
                    marginTop: "-1.5em",
                  }}
                >
                  {characterCount}/{maxCommentLength}
                </div>
              </Grid>

              <Grid item lg={4}></Grid>
              <Grid item lg={4}>
                <Grid container spacing={2} justifyContent="flex-end" mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      ยอดรวม
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      value="0"
                      className={classes.MtextField}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="flex-end" mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      ภาษี(7%)
                    </Typography>
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      value="0"
                      className={classes.MtextField}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} justifyContent="flex-end" mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      ลด/ชาร์ท
                    </Typography>
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      value="0"
                      className={classes.MtextField}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} justifyContent="flex-end" mb={1}>
                  <Grid item lg={5}></Grid>
                  <Grid item lg={3} alignItems="flex-end">
                    <Typography variant="body2" pt={1}>
                      <b>ยอดรวมทั้งสิ้น</b>
                    </Typography>
                  </Grid>
                  <Grid item lg={4}>
                    <TextField
                      id="txtParamQuery"
                      name="paramQuery"
                      size="small"
                      value="0"
                      className={classes.MtextField}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupplierOrderDetail;
