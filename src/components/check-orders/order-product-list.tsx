import React from "react";
import { useAppSelector } from "../../store/store";
import { DataGrid, GridColDef, GridRowData, } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { OrderProductListProps } from '../../models/order';
import { TramOutlined } from "@mui/icons-material";

const OrderProductList: React.FC<OrderProductListProps> = props => {
  const { shipment, defaultOpen } = props;
  console.log("GridRowId: ", shipment);
  const items = useAppSelector((state) => state.checkOrderList);
  const res: any = items.orderList;
  const [open, setOpen] = React.useState(defaultOpen);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "col1", headerName: "ลำดับ", minWidth: 120 },
    {
      field: "productId",
      headerName: "รหัสสินค้า",
      minWidth: 150,
    },
    { field: "productBarCode", headerName: "บาร์โค้ด", minWidth: 200 },
    { field: "productDescription", headerName: "รายละเอียดสินค้า", minWidth: 350 },
    { field: "productUnit", headerName: "หน่วย", minWidth: 150 },
    { field: "productQuantityRef", headerName: "จำนวนอ้างอิง", minWidth: 200 },
    { field: "productQuantityActual", headerName: "จำนวนรับจริง", minWidth: 200 },
    { field: "productDifference", headerName: "ส่วนต่างการรับ", minWidth: 200 },
  ];

  const productsFilter = res.filter(
    (orders: any) => orders.orderShipment === shipment
  )
  console.log(productsFilter)
  const products: any = productsFilter[0].products;
  const rows = products.map((product: any, index: any) => {
    return {
      id: product.productBarCode,
      col1: index + 1,
      productId: product.productId,
      productBarCode: product.productBarCode,
      productDescription: product.productDescription,
      productUnit: product.productUnit,
      productQuantityRef: product.productQuantityRef,
      productQuantityActual: product.productQuantityActual,
      productDifference: product.productDifference
    }
  })

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth={true} >
        <DialogContent>
          <Box mt={2} bgcolor='background.paper'>
            <div>
              <DataGrid rows={rows} columns={columns}
                autoHeight />
            </div>
          </Box>
        </DialogContent>
      </Dialog>


    </div>
  );
}

export default OrderProductList;
