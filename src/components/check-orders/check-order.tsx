import moment from "moment";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, InputLabel } from "@mui/material";
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
import { useStyles } from "../../styles/makeTheme";
import { dateToStringCriteria } from "../../utils/date-utill";

// moment.locale("en");
moment.locale("th");

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
    dateFrom: "",
    dateTo: "",
  });

  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
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
      limit: "5",
      page: "1",
      shipmentNo: values.orderShipment,
      sdNo: values.orderNo,
      dateFrom: moment(startDate).startOf("day").toISOString(),
      dateTo: moment(endDate).endOf("day").toISOString(),
      sdStatus: parseInt(values.orderStatus),
      sdType: parseInt(values.orderType),
      clearSearch: false,
    };

    handleOpenLoading("open", true);
    await dispatch(featchOrderListAsync(payload));
    await dispatch(saveSearchCriteria(payload));
    handleOpenLoading("open", false);
    // console.log("startDate: ", dateToStringCriteria(startDate));
    // console.log("endDate: ", dateToStringCriteria(endDate, false));
    // console.log(`Search Criteria: ${JSON.stringify(payload)}`);
  };

  const onClickClearBtn = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setValues({
      orderShipment: "",
      orderNo: "",
      orderStatus: "ALL",
      orderType: "ALL",
      dateFrom: "",
      dateTo: "",
    });

    const payload: ShipmentRequest = {
      limit: "5",
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
      {/* <Box sx={{ flexGrow: 1 }}> */}
      <Box>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id="txtOrderShipment"
              name="orderShipment"
              size="small"
              value={values.orderShipment}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="เลขที่เอกสาร LD/เลขที่เอกสาร SD"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ประเภท
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selOrderType"
                name="orderType"
                value={values.orderType}
                onChange={handleChange}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value={"ALL"} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={"0"}>ลังกระดาษ/ลังพลาสติก</MenuItem>
                <MenuItem value={"1"}>สินค้าภายในTote</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สถานะ
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selOrderStatus"
                name="orderStatus"
                value={values.orderStatus}
                onChange={handleChange}
                inputProps={{ "aria-label": "Without label" }}
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

          <Grid item xs={4} sx={{ pt: 30 }}>
            <Typography gutterBottom variant="subtitle1" component="div">
              วันที่รับสินค้า
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div">
              ตั้งแต่
            </Typography>
            <DatePickerComponent
              onClickDate={handleStartDatePicker}
              value={startDate}
            />
          </Grid>
          <Grid item xs={4} container alignItems="flex-end">
            <Box sx={{ width: "100%" }}>
              <Typography gutterBottom variant="subtitle1" component="div">
                ถึง
              </Typography>
              <DatePickerComponent
                onClickDate={handleEndDatePicker}
                value={endDate}
              />
            </Box>
          </Grid>
          <Grid
            item
            container
            xs={4}
            justifyContent="flex-end"
            direction="row"
            alignItems="flex-end"
          >
            <Button
              id="btnSearch"
              variant="contained"
              color="primary"
              size="large"
              onClick={onClickSearchBtn}
              sx={{ width: "40%" }}
            >
              ค้นหา
            </Button>
            <Button
              id="btnClear"
              variant="contained"
              size="large"
              onClick={onClickClearBtn}
              sx={{ backgroundColor: "#AEAEAE", ml: 2, width: "40%" }}
            >
              เคลียร์
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mt={6}></Box>
      {items.orderList && <OrderList />}
      <LoadingModal open={openLoadingModal.open} />
    </>
  );
}

export default CheckOrderSearch;
