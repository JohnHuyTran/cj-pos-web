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
  featchOrderListDcAsync,
  clearDataFilter,
} from "../../store/slices/dc-check-order-slice";
import { featchBranchListAsync } from "../../store/slices/search-branches-slice";
import { clearSearchCriteriaDc } from "../../store/slices/save-search-order-dc-slice";
import { saveSearchCriteriaDc } from "../../store/slices/save-search-order-dc-slice";
import { CheckOrderRequest } from "../../models/dc-check-order-model";
import DCOrderList from "./dc-order-list";
import { useStyles } from "../../styles/makeTheme";
import DatePickerComponent from "../commons/ui/date-picker";
import LoadingModal from "../commons/ui/loading-modal";
import { SearchOff } from "@mui/icons-material";
import { BranchInfo, BranchResponse } from "../../models/search-branch-model";

moment.locale("th");

interface State {
  shipmentNo: string;
  branchCode: string;
  verifyDCStatus: string;
  dateFrom: string;
  dateTo: string;
  sdType: string;
  sortBy: string;
}
interface loadingModalState {
  open: boolean;
}

function DCCheckOrderSearch() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.dcCheckOrderList);
  const branchList = useAppSelector((state) => state.searchBranchSlice);
  const [values, setValues] = React.useState<State>({
    shipmentNo: "",
    branchCode: "ALL",
    verifyDCStatus: "ALL",
    dateFrom: "",
    dateTo: "",
    sdType: "ALL",
    sortBy: "",
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [openLoadingModal, setOpenLoadingModal] =
    React.useState<loadingModalState>({
      open: false,
    });

  useEffect(() => {
    dispatch(featchBranchListAsync());
  }, []);



  // console.log("branchList: ", branchList.branchList.data);

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    // console.log("value in handle change: ", values);
  };

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const onClickSearchBtn = async () => {
    const payload: CheckOrderRequest = {
      limit: "10",
      page: "1",
      shipmentNo: values.shipmentNo,
      branchCode: values.branchCode,
      verifyDCStatus: values.verifyDCStatus,
      dateFrom: moment(startDate).startOf("day").toISOString(),
      dateTo: moment(endDate).endOf("day").toISOString(),
      sdType: values.sdType,
      sortBy: values.sortBy,
      clearSearch: false,
    };

    handleOpenLoading("open", true);
    await dispatch(featchOrderListDcAsync(payload));
    await dispatch(saveSearchCriteriaDc(payload));
    handleOpenLoading("open", false);

    // console.log(`Search Criteria: ${JSON.stringify(payload)}`);
  };

  const onClickClearBtn = async () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setValues({
      shipmentNo: "",
      branchCode: "ALL",
      verifyDCStatus: "ALL",
      dateFrom: "",
      dateTo: "",
      sdType: "ALL",
      sortBy: "",
    });

    // items.orderList = '';

    const payload: CheckOrderRequest = {
      limit: "10",
      page: "1",
      shipmentNo: values.shipmentNo,
      branchCode: values.branchCode,
      verifyDCStatus: values.verifyDCStatus,
      dateFrom: moment(startDate).startOf("day").toISOString(),
      dateTo: moment(endDate).endOf("day").toISOString(),
      sdType: values.sdType,
      sortBy: values.sortBy,
      clearSearch: true,
    };

    dispatch(featchOrderListDcAsync(payload));
  };

  // useEffect(() => {
  //   dispatch(clearDataFilter());
  // }, []);

  const handleStartDatePicker = (value: Date) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const handleChangeBranch = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, branchCode: value });
  }

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
    orderListData = <DCOrderList />;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              ค้นหาเอกสาร
            </Typography>
            <TextField
              id="txtShipmentNo"
              name="shipmentNo"
              size="small"
              value={values.shipmentNo}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="เลขที่เอกสาร LD/เลขที่เอกสาร SD"
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สาขาปลายทาง
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selBranchNo"
                name="branchNo"
                value={values.branchCode}
                inputProps={{ "aria-label": "Without label" }}
                onChange={handleChangeBranch}
              >
                <MenuItem value={"ALL"} selected={true}>
                  ทั้งหมด
                </MenuItem>
                {branchList.branchList.data.map((option: BranchInfo, index: number) => (
                  <MenuItem key={option.code} value={option.code}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selBranchNo"
                name="branchNo"
                value={values.orderStatus}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value={"ALL"} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={"0"}>วัดโคก</MenuItem>
                <MenuItem value={"1"}>ซอยใจเอื้อ</MenuItem>
              </Select>
            </FormControl> */}
            {/* <TextField
              id="txtBranchCode"
              name="branchCode"
              size="small"
              value={values.branchCode}
              onChange={handleChange}
              className={classes.MtextField}
              fullWidth
              placeholder="branchCode"
            /> */}
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
              สถานะการตรวจสอบผลต่าง
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selVerifyDCStatus"
                name="verifyDCStatus"
                value={values.verifyDCStatus}
                onChange={handleChange}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value={"ALL"} selected={true}>
                  ทั้งหมด
                </MenuItem>
                <MenuItem value={"0"}>รอการตรวจสอบ</MenuItem>
                <MenuItem value={"1"}>ตรวจสอบแล้ว</MenuItem>
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
          <Grid item xs={4} container alignItems="flex-end">
            <Typography gutterBottom variant="subtitle1" component="div">
              ประเภท
            </Typography>
            <FormControl fullWidth className={classes.Mselect}>
              <Select
                id="selSdType"
                name="sdType"
                value={values.sdType}
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

          <Grid
            item
            container
            xs={12}
            justifyContent="flex-end"
            direction="row"
            alignItems="flex-end"
          >
            <Button
              id="btnClear"
              variant="contained"
              size="large"
              onClick={onClickClearBtn}
              sx={{ width: "15%" }}
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
              sx={{ width: "15%", ml: 2 }}
              className={classes.MbtnSearch}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mt={6}></Box>
      {/* {items.orderList && <DCOrderList />} */}
      {orderListData}
      <LoadingModal open={openLoadingModal.open} />
    </>
  );
}

export default DCCheckOrderSearch;
