import moment from "moment";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  featchOrderListAsync,
  clearDataFilter,
} from "../../store/slices/check-order-slice";
import {
  saveSearchCriteria,
  clearSearchCriteria,
} from "../../store/slices/save-search-order";
import { ShipmentRequest } from "../../models/order-model";
import OrderList from "./order-list";
import DatePickerComponent from "../commons/ui/date-picker";
import LoadingModal from "../commons/ui/loading-modal";
import { useStyles } from "../../styles/maekTheme";

moment.locale("en");

interface State {
  orderShipment: string;
  orderNo: string;
  orderStatus: string;
  orderType: string;
  dateFrom: string;
  dateTo: string;
}
interface loadingModalState {
  open: boolean;
}

function CheckOrderSearch() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.checkOrderList);
  const [values, setValues] = React.useState<State>({
    orderShipment: "",
    orderNo: "",
    orderStatus: "ALL",
    orderType: "ALL",
    dateFrom: "10/10/2021",
    dateTo: "11/10/2021",
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    console.log(values);
  };
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const onClickSearchBtn = async () => {
    const payload: ShipmentRequest = {
      limit: "10",
      page: "1",
      shipmentNo: values.orderShipment,
      sdNo: values.orderNo,
      dateFrom: moment(startDate).format("DD/MM/YYYY"),
      dateTo: moment(endDate).format("DD/MM/YYYY"),
      sdStatus: parseInt(values.orderStatus),
      sdType: parseInt(values.orderType),
      clearSearch: false,
    };
    handleOpenLoading("open", true);
    await dispatch(featchOrderListAsync(payload));
    await dispatch(saveSearchCriteria(payload));
    handleOpenLoading("open", false);
    console.log(`Search Criteria: ${JSON.stringify(payload)}`);
  };

  const onClickClearBtn = () => {
    setValues({
      orderShipment: "",
      orderNo: "",
      orderStatus: "ALL",
      orderType: "ALL",
      dateFrom: "10/10/2021",
      dateTo: "11/10/2021",
    });
    setStartDate(new Date());
    setEndDate(new Date());
    const payload: ShipmentRequest = {
      limit: "10",
      page: "1",
      shipmentNo: values.orderShipment,
      sdNo: values.orderNo,
      dateFrom: moment(startDate).format("DD/MM/YYYY"),
      dateTo: moment(endDate).format("DD/MM/YYYY"),
      sdStatus: parseInt(values.orderStatus),
      sdType: parseInt(values.orderType),
      clearSearch: true,
    };
    dispatch(featchOrderListAsync(payload));
    dispatch(clearSearchCriteria());
  };

  const handleStartDatePicker = (value: Date) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const classes = useStyles();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="subtitle1" gutterBottom component="div">
              เลขที่เอกสาร LD
            </Typography>
            <TextField
              id="txtOrderShipment"
              size="small"
              name="orderShipment"
              value={values.orderShipment}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle1" gutterBottom component="div">
              เลขที่เอกสาร SD
            </Typography>
            <TextField
              id="txtOrderNo"
              size="small"
              name="orderNo"
              value={values.orderNo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1" gutterBottom component="div">
              วันที่รับสินค้า ตั้งแต่
            </Typography>
            <DatePickerComponent
              onClickDate={handleStartDatePicker}
              value={startDate}
            />
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle1" gutterBottom component="div">
              ถึง
            </Typography>
            <DatePickerComponent
              onClickDate={handleEndDatePicker}
              value={endDate}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1" gutterBottom component="div">
              สถานะ
            </Typography>
            <FormControl className={classes.Mselect} sx={{ width: 193 }}>
              <Select
                id="selOrderStatus"
                name="orderStatus"
                value={values.orderStatus}
                onChange={handleChange}
                inputProps={{ "aria-label": "Without label" }}
                autoWidth={true}
              >
                <MenuItem value={"ALL"} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={"0"}>บันทึก</MenuItem>
                <MenuItem value={"1"}>อนุมัติ</MenuItem>
                <MenuItem value={"2"}>ปิดงาน</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle1" gutterBottom component="div">
              ประเภท
            </Typography>
            <FormControl className={classes.Mselect} sx={{ width: 193 }}>
              <Select
                id="selOrderType"
                name="orderType"
                value={values.orderType}
                onChange={handleChange}
                inputProps={{ "aria-label": "Without label" }}
                autoWidth={true}
              >
                <MenuItem value={"ALL"} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={"0"}>ลังกระดาษ/ลังพลาสติก</MenuItem>
                <MenuItem value={"1"}>สินค้าภายในTote</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                width: "150px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                id="btnSearch"
                variant="contained"
                color="primary"
                onClick={onClickSearchBtn}
              >
                ค้นหา
              </Button>
              <Button
                id="btnClear"
                variant="contained"
                onClick={onClickClearBtn}
                sx={{ backgroundColor: "#AEAEAE" }}
              >
                เคลียร์
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {items.orderList && <OrderList />}
      <LoadingModal open={openLoadingModal.open} />
    </>
  );
}

export default CheckOrderSearch;
