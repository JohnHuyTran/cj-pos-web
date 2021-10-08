import React, { useEffect } from 'react';
import { useAppSelector } from '../../store/store';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { Item, ShipmentInfo, ShipmentResponse } from '../../models/order-model';
import { useStyles } from './order-css';
import PrintIcon from '@mui/icons-material/Print';
import ImportExport from '@mui/icons-material/ImportExport';

interface OrderProductListProps {
  // shipment: GridRowId | undefined;
  shipment: any | undefined;
  defaultOpen: boolean;
  onClickClose: any;
}

const OrderProductList: React.FC<OrderProductListProps> = (props) => {
  const classes = useStyles();
  const { shipment, defaultOpen } = props;
  const items = useAppSelector((state) => state.checkOrderList);
  const res: ShipmentResponse = items.orderList;
  const [open, setOpen] = React.useState(defaultOpen);
  useEffect(() => {
    setOpen(defaultOpen);
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.onClickClose();
  };

  const columns: GridColDef[] = [
    { field: 'col1', headerName: 'ลำดับ', minWidth: 120 },
    {
      field: 'productId',
      headerName: 'รหัสสินค้า',
      minWidth: 150,
    },
    { field: 'productBarCode', headerName: 'บาร์โค้ด', minWidth: 200 },
    {
      field: 'productDescription',
      headerName: 'รายละเอียดสินค้า',
      minWidth: 350,
    },
    { field: 'productUnit', headerName: 'หน่วย', minWidth: 150 },
    { field: 'productQuantityRef', headerName: 'จำนวนอ้างอิง', minWidth: 200 },
    {
      field: 'productQuantityActual',
      headerName: 'จำนวนรับจริง',
      minWidth: 200,
    },
    { field: 'productDifference', headerName: 'ส่วนต่างการรับ', minWidth: 200 },
  ];

  const productsFilter: ShipmentInfo[] = res.data.filter(
    (orders: ShipmentInfo) => orders.shipmentNo === shipment
  );
  const rows = productsFilter[0].entries[0].items?.map(
    (product: Item, index: number) => {
      return {
        id: product.barcode,
        col1: index + 1,
        productId: product.skuCode,
        productBarCode: product.barcode,
        productDescription: product.productName,
        productUnit: product.unit.name,
        productQuantityRef: product.quantity.qty,
        productQuantityActual: product.quantity.actualQty,
        productDifference: product.quantity.qtyDiff,
      };
    }
  );

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth={true}>
        <DialogContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  SHIPMENT:
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='body2' gutterBottom>
                  {productsFilter[0].shipmentNo}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  เลขที่เอกสาร:
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  {productsFilter[0].sdNo}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  Type:
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='body2' gutterBottom>
                  {productsFilter[0].sdType}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  วันที่:
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  {productsFilter[0].shipmentDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  สถานะ:
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant='body2' gutterBottom>
                  {productsFilter[0].sdStatus}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Grid
            container
            spacing={2}
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <Grid item>
              <Button
                id='printBtb'
                variant='contained'
                color='primary'
                className={classes.searchBtn}
              >
                APPROVE
              </Button>
            </Grid>

            <Grid item>
              <Button
                id='printBtb'
                variant='contained'
                color='primary'
                className={classes.searchBtn}
              >
                BACK
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            direction='row'
            alignItems='right'
            justifyContent='right'
          >
            <Grid item>
              {' '}
              <Button
                id='printBtb'
                variant='contained'
                color='primary'
                endIcon={<PrintIcon />}
                className={classes.searchBtn}
              >
                PRINT
              </Button>
            </Grid>

            <Grid item>
              {' '}
              <Button
                id='printBtb'
                variant='contained'
                color='primary'
                endIcon={<ImportExport />}
                className={classes.searchBtn}
              >
                EXPORT
              </Button>
            </Grid>
          </Grid>
          <Box mt={2} bgcolor='background.paper'>
            <div>
              <DataGrid rows={rows ? rows : []} columns={columns} autoHeight />
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderProductList;
