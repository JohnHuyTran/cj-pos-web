import React, { ReactElement } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridRowData,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Entry, ShipmentInfo } from "../../models/order-model";
import { useAppSelector } from "../../store/store";
import {
  CheckOrderDetailInfo,
  CheckOrderDetailItims,
} from "../../models/dc-check-order-model";

import { useStyles } from "../../styles/makeTheme";

interface Props {
  //   sdNo: string;
  items: [];
}

const columns: GridColDef[] = [
  { field: "index", headerName: "ลำดับ", width: 90, disableColumnMenu: true },
  {
    field: "productId",
    headerName: "รหัสสินค้า",
    width: 170,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "productBarCode",
    headerName: "บาร์โค้ด",
    minWidth: 170,
    disableColumnMenu: true,
    headerAlign: "center",
  },
  {
    field: "productDescription",
    headerName: "รายละเอียดสินค้า",
    minWidth: 200,
    headerAlign: "center",
  },
  {
    field: "productUnit",
    headerName: "หน่วย",
    minWidth: 90,
    headerAlign: "center",
  },
  {
    field: "productQuantityRef",
    headerName: "จำนวนอ้างอิง",
    width: 135,
    type: "number",
    headerAlign: "center",
  },
  {
    field: "productQuantityActual",
    headerName: "จำนวนรับจริง",
    width: 135,
    type: "number",
    headerAlign: "center",
  },
  {
    field: "productDifference",
    headerName: "จำนวนส่วนต่าง",
    width: 145,
    type: "number",
    headerAlign: "center",
    renderCell: (params) => calProductDiff(params),
  },
  {
    field: "productComment",
    headerName: "หมายเหตุ",
    width: 200,
    type: "number",
    headerAlign: "center",
  },
];

var calProductDiff = function (params: GridValueGetterParams) {
  let diff =
    Number(params.getValue(params.id, "productQuantityActual")) -
    Number(params.getValue(params.id, "productQuantityRef"));

  if (diff > 0)
    return (
      <label style={{ color: "#446EF2", fontWeight: 700 }}> +{diff} </label>
    );
  if (diff < 0)
    return (
      <label style={{ color: "#F54949", fontWeight: 700 }}> {diff} </label>
    );
  return diff;
};

export default function DCOrderEntries({ items }: Props): ReactElement {
  const classes = useStyles();
  const rows = items.map((item: CheckOrderDetailItims, index: number) => {
    return {
      id: `${item.barcode}-${index + 1}`,
      index: index + 1,
      productId: item.skuCode,
      productBarCode: item.barcode,
      productDescription: item.productName,
      productUnit: item.unitName,
      productQuantityRef: item.qty,
      productQuantityActual: item.actualQty,
      productDifference: item.qtyDiff,
      productComment: item.comment,
    };
  });

  return (
    <Box mt={2} bgcolor="background.paper">
      <div
        className={classes.MdataGrid}
        style={{ width: "100%", marginBottom: "1em" }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          autoPageSize={true}
          pagination={true}
          pageSize={5}
          editMode="row"
          autoHeight
        />
      </div>
    </Box>
  );
}
