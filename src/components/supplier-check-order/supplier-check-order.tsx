import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import React from "react";

import { useStyles } from "../../styles/makeTheme";

interface State {
  paramQuery: string;
  // orderNo: string;
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

  const handleChange = (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
    // console.log(values);
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
      </Grid>
    </Box>
  );
}
