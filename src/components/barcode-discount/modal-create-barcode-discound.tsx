import React, { useState, ReactElement } from "react";
import { Box } from "@mui/system";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  FormControl,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import { useStyles } from "../../styles/makeTheme";
import StepperBar from "./stepper-bar";
import { BootstrapDialogTitle } from "../commons/ui/dialog-title";
import ModalAddItems from "../commons/ui/modal-add-items";
import ModalBacodeTransferItem from "./modal-barcode-transfer-item";
import moment from "moment";
import ModelConfirm from "./modal-confirm";
interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}
interface Column {
  id: "name" | "code" | "population" | "size" | "density";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}
const columns: Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
  {
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Size\u00a0(km\u00b2)",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
  createData("Mexico", "MX", 126577691, 1972550),
  createData("Japan", "JP", 126317000, 377973),
  createData("France", "FR", 67022000, 640679),
  createData("United Kingdom", "GB", 67545757, 242495),
  createData("Russia", "RU", 146793744, 17098246),
  createData("Nigeria", "NG", 200962417, 923768),
  createData("Brazil", "BR", 210147125, 8515767),
];
export default function ModalCreateBarcodeDiscount({
  isOpen,
  onClickClose,
}: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const [page, setPage] = React.useState(0);
  const [piStatus, setPiStatus] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [valueRadios, setValueRadios] = React.useState<string>("percent");
  const [openModalCancel, setOpenModalCancel] = React.useState<boolean>(false);
  const classes = useStyles();

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleCancel = () => {
    setOpenModalCancel(true)
  }
  const handleCloseModalCancel = () => {
    setOpenModalCancel(false)
  }

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueRadios(event.target.value);
  };
  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={!!true}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography sx={{ fontSize: "1em" }}>
            ใบรับสินค้าจากผู้จำหน่าย
          </Typography>
          <StepperBar />
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid container sx={{ paddingTop: "50px" }}>
            <Grid item container xs={6} sx={{ marginBottom: "15px" }}>
              <Grid item xs={4}>
                เลขที่เอกสาร BD :
              </Grid>
              <Grid item xs={4}>
                BD21110276-000006
              </Grid>
            </Grid>
            <Grid container item xs={6} sx={{ marginBottom: "15px" }}>
              <Grid item xs={4}>
                วันที่อนุมัติ :
              </Grid>
              <Grid item xs={4}>
                -
              </Grid>
            </Grid>
            <Grid container item xs={6} sx={{ marginBottom: "15px" }}>
              <Grid item xs={4}>
                วันที่ขอส่วนลด
              </Grid>
              <Grid item xs={4}>
                {moment(createDate).format("DD/MM/YYYY")}
              </Grid>
            </Grid>
            <Grid container item xs={6} sx={{ marginBottom: "15px" }}>
              <Grid item xs={4}>
                สาขา :
              </Grid>
              <Grid item xs={8}>
                0223-สาขาที่00236 สนามจันทร์ (ชุมชนจัทรคามพิทักษ์)
              </Grid>
            </Grid>
            <Grid item container xs={6} sx={{ marginBottom: "15px" }}>
              <Grid item xs={4}>
                ยอดลด : :
              </Grid>
              <Grid item xs={8}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="discount"
                    value={valueRadios}
                    defaultValue={"percent"}
                    name="radio-buttons-group"
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      value: string
                    ) => {
                      handleChangeRadio(event);
                    }}
                  >
                    <FormControlLabel
                      value="percent"
                      control={<Radio />}
                      label="ยอดลดเป็นเปอร์เซ็น (%)"
                    />
                    <FormControlLabel
                      value="amount"
                      control={<Radio />}
                      label="ยอดลดเป็นจำนวนเงิน (บาท)"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Box>
            <Box
              sx={{ display: "flex", marginBottom: "18px", marginTop: "20px" }}
            >
              <Box>
                <Button
                  id="btnAddItem"
                  variant="contained"
                  color="info"
                  className={classes.MbtnPrint}
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={handleOpenAddItems}
                  sx={{ width: 200 }}
                >
                  เพิ่มสินค้า
                </Button>
              </Box>
              <Box sx={{ marginLeft: "auto" }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<SaveIcon />}
                >
                  เพิ่มสินค้า
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ margin: "0 17px" }}
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  เพิ่มสินค้า
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<HighlightOffIcon />}
                  onClick={handleCancel}
                >
                  เพิ่มสินค้า
                </Button>
              </Box>
            </Box>
            {/* <Paper
              sx={{
                width: "100%",
                overflow: "hidden",
                padding: "17px 0 30px 0",
              }}
            >
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === "number"
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper> */}
            <ModalBacodeTransferItem id="" typeDiscount={valueRadios} />
          </Box>
        </DialogContent>
      </Dialog>

      <ModalAddItems
        open={openModelAddItems}
        onClose={handleModelAddItems}
      ></ModalAddItems>
      <ModelConfirm open={openModalCancel} onClose={handleCloseModalCancel} requesterId="4234213" barCode="234234235524" />
    </div>
  );
}
