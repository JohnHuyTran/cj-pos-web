import React, { useEffect } from "react";
import { useAppSelector } from "../../store/store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from '@mui/material/Typography';

import { OrderProductListProps, Order, Product } from '../../models/order';



const OrderProductList: React.FC<OrderProductListProps> = props => {

  const { shipment, defaultOpen } = props;
  console.log("defaultOpen: ", defaultOpen);
  const items = useAppSelector((state) => state.checkOrderList);
  const res: Order[] = items.orderList;
  const [open, setOpen] = React.useState(defaultOpen);
  console.log("open: ", open);
  useEffect(() => {
    console.log("use effect");
    setOpen(defaultOpen);
  }, [open])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.onClickClose();
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



  const productsFilter: Order[] = res.filter(
    (orders: Order) => orders.orderShipment === shipment
  )
  const rows = productsFilter[0].products?.map((product: Product, index: number) => {
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
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>SHIPMENT:</Typography>
              </Grid>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>{productsFilter[0].orderShipment}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>

              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>เลขที่เอกสาร:</Typography>
              </Grid>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>{productsFilter[0].orderNo}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>Type:</Typography>
              </Grid>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>{productsFilter[0].orderType}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>วันที่:</Typography>
              </Grid>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>{productsFilter[0].orderCreateDate}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>สถานะ:</Typography>
              </Grid>
              <Grid item xs={1}  >
                <Typography variant="body2" gutterBottom>{productsFilter[0].orderStatus}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2} bgcolor='background.paper'>
            <div>
              <DataGrid rows={rows ? rows : []} columns={columns}
                autoHeight />
            </div>
          </Box>
        </DialogContent>
      </Dialog>


    </div>
  );
}

export default OrderProductList;