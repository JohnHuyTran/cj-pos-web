import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";

import DatePickerComponent from "../commons/ui/date-picker";
import { useStyles } from "../../styles/makeTheme";
import { Button } from "@mui/material";

interface State {
  paramQuery: string;
  piStatus: string;
  piType: string;
  dateFrom: string;
  dateTo: string;
}

export default function SupplierCheckOrderSearch() {
  const classes = useStyles();

  const [values, setValues] = React.useState<State>({
    paramQuery: "",
    // orderNo: "",
    piStatus: "0",
    piType: "ALL",
    dateFrom: "",
    dateTo: "",
  });
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    // console.log(values);
  };

  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  return (
    <Box>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 7 }}>
        <Grid item xs={4}>
          <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
            ค้นหาเอกสาร
          </Typography>
          <TextField
            id="txtParamQuery"
            name="paramQuery"
            size="small"
            value={values.paramQuery}
            onChange={handleChange}
            className={classes.MtextField}
            fullWidth
            placeholder="เลขที่ใบสั่งซื้อ PO/รหัสผู้จำหน่าย/ชื่อผู้จำหน่าย"
          />
        </Grid>
        <Grid item xs={4}>
          <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
            สถานะ
          </Typography>
          <FormControl fullWidth className={classes.Mselect}>
            <Select
              id="selPiStatus"
              name="piStatus"
              value={values.piStatus}
              onChange={handleChange}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={"ALL"}>ทั้งหมด</MenuItem>
              <MenuItem value={"0"}>บันทึก</MenuItem>
              <MenuItem value={"1"}>อนุมัติ</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Typography gutterBottom variant="subtitle1" component="div" mb={1}>
            เอกสารใบสั่งซื้อ
          </Typography>
          <FormControl fullWidth className={classes.Mselect}>
            <Select
              id="selPiType"
              name="piType"
              value={values.piType}
              onChange={handleChange}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={"ALL"}>ทั้งหมด</MenuItem>
              <MenuItem value={"0"}>มี PO</MenuItem>
              <MenuItem value={"1"}>ไม่มี PO</MenuItem>
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
          xs={12}
          sx={{ mt: 3 }}
          justifyContent="flex-end"
          direction="row"
          alignItems="flex-end"
        >
          <Button
            id="btnClear"
            variant="contained"
            size="large"
            // onClick={onClickClearBtn}
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
            // onClick={onClickValidateForm}
            sx={{ width: "15%", ml: 2 }}
            className={classes.MbtnSearch}
          >
            ค้นหา
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
