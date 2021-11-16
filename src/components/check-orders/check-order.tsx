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
import { getShipmentTypeText } from "../../utils/enum/check-order-enum";
import { ShipmentRequest } from "../../models/order-model";
import OrderList from "./order-list";
import DatePickerComponent from "../commons/ui/date-picker";
import LoadingModal from "../commons/ui/loading-modal";
import { useStyles } from "../../styles/makeTheme";
import { SearchOff } from "@mui/icons-material";
import { dateToStringCriteria } from "../../utils/date-utill";
import AlertError from "../commons/ui/alert-error";
import {
  DatePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

// moment.locale("en");
moment.locale("th");

interface State {
  orderShipment: string;
  // orderNo: string;
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
  const classes = useStyles();
  const items = useAppSelector((state) => state.checkOrderList);
  const [values, setValues] = React.useState<State>({
    orderShipment: "",
    // orderNo: "",
    orderStatus: "ALL",
    orderType: "ALL",
    dateFrom: "",
    dateTo: "",
  });

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  // const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState("");

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    // console.log(values);
  };
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const validateForm = () => {
    if (
      values.orderShipment === "" &&
      values.orderStatus === "ALL" &&
      values.orderType === "ALL" &&
      startDate === null &&
      endDate === null
    ) {
      setOpenAlert(true);
      setTextError("กรุณากรอกข้อมูลค้นหา");
    } else if (
      values.orderShipment === "" &&
      values.orderStatus === "ALL" &&
      values.orderType === "ALL"
    ) {
      if (startDate === null || endDate === null) {
        setOpenAlert(true);
        setTextError("กรุณากรอกวันที่รับสินค้าให้ครบ");
      }
    }
  };

  const onClickSearchBtn = async () => {
    const payload: ShipmentRequest = {
      limit: "5",
      page: "1",
      paramQuery: values.orderShipment,
      // sdNo: values.orderNo,
      dateFrom: moment(startDate).startOf("day").toISOString(),
      dateTo: moment(endDate).endOf("day").toISOString(),
      sdStatus: parseInt(values.orderStatus),
      sdType: parseInt(values.orderType),
      clearSearch: false,
    };

    handleOpenLoading("open", true);
    await validateForm();
    await dispatch(featchOrderListAsync(payload));
    await dispatch(saveSearchCriteria(payload));
    handleOpenLoading("open", false);
    // console.log("startDate: ", dateToStringCriteria(startDate));
    // console.log("endDate: ", dateToStringCriteria(endDate, false));
    // console.log(`Search Criteria: ${JSON.stringify(payload)}`);
  };

  const onClickClearBtn = () => {
    setStartDate(null);
    setEndDate(null);
    setValues({
      orderShipment: "",
      // orderNo: "",
      orderStatus: "ALL",
      orderType: "ALL",
      dateFrom: "",
      dateTo: "",
    });

    const payload: ShipmentRequest = {
      limit: "5",
      page: "1",
      paramQuery: values.orderShipment,
      // sdNo: values.orderNo,
      dateFrom: moment(startDate).format("DD/MM/YYYY"),
      dateTo: moment(endDate).format("DD/MM/YYYY"),
      sdStatus: parseInt(values.orderStatus),
      sdType: parseInt(values.orderType),
      clearSearch: true,
    };
    dispatch(featchOrderListAsync(payload));
    dispatch(clearSearchCriteria());
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  let orderListData;
  const orderListDatas = items.orderList.data;

  if (orderListDatas.length === 0) {
    orderListData = (
      <Grid item container xs={12} justifyContent="center">
        <Box color="#CBD4DB">
          <h2>
            ไม่มีข้อมูล <SearchOff fontSize="large" />
          </h2>
        </Box>
      </Grid>
    );
  } else {
    orderListData = <OrderList />;
  }

  //check dateFrom-dateTo
  if (endDate != null && startDate != null) {
    if (endDate < startDate) {
      setEndDate(null);
    }
  }

  //alert Errormodel
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

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
                <MenuItem value={"0"}>{getShipmentTypeText(0)}</MenuItem>
                <MenuItem value={"1"}>{getShipmentTypeText(1)}</MenuItem>
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
                type={"TO"}
                minDateTo={startDate}
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
              id="btnClear"
              variant="contained"
              size="large"
              onClick={onClickClearBtn}
              sx={{ width: "40%" }}
              className={classes.MbtnClear}
            >
              เคลียร์
            </Button>
            <Button
              id="btnSearch"
              variant="contained"
              color="primary"
              size="large"
              onClick={onClickSearchBtn}
              sx={{ width: "40%", ml: 2 }}
              className={classes.MbtnSearch}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mt={6}></Box>
      {/* {items.orderList && <OrderList />} */}
      {orderListData}
      <LoadingModal open={openLoadingModal.open} />

      <AlertError
        open={openAlert}
        onClose={handleCloseAlert}
        titleError="Failed"
        textError={textError}
      />
    </>
  );
}

export default CheckOrderSearch;
