import React from "react";
import { useAppSelector } from "../../store/store";
import { DataGrid, GridColDef, GridRowData } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function OrderProductList() {
  const items = useAppSelector((state) => state.checkOrderList);
  console.log("items == ", items.orderList);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const columns: GridColDef[] = [
  //   { field: "col1", headerName: "ลำดับ", minWidth: 120 },
  //   {
  //     field: "col2",
  //     headerName: "รหัสสินค้า",
  //     minWidth: 150,
  //   },
  //   { field: "col3", headerName: "บาร์โค้ด", minWidth: 200 },
  //   { field: "col4", headerName: "รายละเอียดสินค้า", minWidth: 350 },
  //   { field: "col5", headerName: "หน่วย", minWidth: 150 },
  //   { field: "col6", headerName: "จำนวนอ้างอิง", minWidth: 200 },
  //   { field: "col7", headerName: "จำนวนรับจริง", minWidth: 200 },
  //   { field: "col8", headerName: "ส่วนต่างการรับ", minWidth: 200 },
  // ];

  // const shipment = "LD234587";
  // const productsFilter = items.orderList?.orders && items.orderList.orders?.filter(
  //   (orders) => orders.orderShipment === shipment
  // );

  // console.log(`product: ${productsFilter}`);

  return (
    <div>
      product list
    </div>
  );
}

export default OrderProductList;
