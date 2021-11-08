import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Entry } from "../../models/order-model";
import Typography from "@mui/material/Typography";
import { border } from "@mui/lab/node_modules/@mui/system";

interface DataDiffInfyProps {
  items: Entry[];
}

export default function DataDiffInfo(props: DataDiffInfyProps) {
  const { items } = props;

  return (
    <TableContainer
      component={Paper}
      id="tblItemDifferance"
      style={{ border: "1px solid #676767" }}
    >
      <Table
        sx={{ minWidth: 500, textAlign: "center" }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#36C690" }}>
              <Typography variant="body2">ลำดับ</Typography>
            </TableCell>
            <TableCell sx={{ color: "#36C690" }}>
              <Typography variant="body2">บาร์โค้ด</Typography>
            </TableCell>
            <TableCell sx={{ color: "#36C690" }}>
              <Typography variant="body2">รายละเอียดสินค้า</Typography>
            </TableCell>
            <TableCell sx={{ color: "#36C690" }}>
              <Typography variant="body2">จำนวนส่วนต่าง</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row, index: number) => (
            <TableRow
              key={index + 1}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell> {index + 1}</TableCell>
              <TableCell>{row.barcode}</TableCell>
              <TableCell>{row.productName}</TableCell>
              <TableCell align="right">
                {row.actualQty > 0 && (
                  <label style={{ color: "#446EF2", fontWeight: 700 }}>
                    {" "}
                    +{row.actualQty}{" "}
                  </label>
                )}
                {row.actualQty < 0 && (
                  <label style={{ color: "#F54949", fontWeight: 700 }}>
                    {" "}
                    {row.actualQty}{" "}
                  </label>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
