import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { CheckOrderResponse, CheckOrderInfo, CheckOrderRequest } from '../../models/dc-check-order-model';
import { featchOrderListDcAsync } from '../../store/slices/dc-check-order-slice';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { getSdType, getDCStatus } from '../../utils/utils';
// import { makeStyles } from '@mui/styles';
import { useStyles } from '../../styles/makeTheme';
import Done from '@mui/icons-material/Done';
import { featchorderDetailDCAsync } from '../../store/slices/dc-check-order-detail-slice';
import LoadingModal from '../commons/ui/loading-modal';
import { PanoramaSharp } from '@mui/icons-material';
import { saveSearchCriteriaDc } from '../../store/slices/save-search-order-dc-slice';
import { Typography } from '@mui/material';
import { ShipmentRequest } from '../../models/order-model';
import { StockTransferInfo, StockTransferResponse } from '../../models/stock-transfer-model';
//import CheckOrderDetail from './check-order-detail';
import { DeleteForever } from '@mui/icons-material';

interface loadingModalState {
  open: boolean;
}

function StockTransferList() {
  const classes = useStyles();
  // const classes = useStyles2();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.searchStockTransfer);
  const cuurentPage = useAppSelector((state) => state.searchStockTransfer.orderList.page);
  const limit = useAppSelector((state) => state.searchStockTransfer.orderList.perPage);
  const res: StockTransferResponse = items.orderList;
  // const payload = useAppSelector((state) => state.saveSearchOrderDc.searchCriteriaDc);
  // const [opensDCOrderDetail, setOpensDCOrderDetail] = React.useState(false);

  const [idDC, setidDC] = React.useState('');

  const [pageSize, setPageSize] = React.useState(limit.toString());

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      width: 70,
      // flex: 0.7,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component="div" sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'btNo',
      headerName: 'เลขที่เอกสาร BT',
      minWidth: 180,
      // flex: 1.3,
      headerAlign: 'center',
      sortable: false,
      // renderCell: (params) => (
      //   <div>
      //     <Typography color="textSecondary">{params.value}</Typography>
      //     <Typography>{params.getValue(params.id, "sdNo") || ""}</Typography>
      //   </div>
      // ),
    },
    {
      field: 'sdNo',
      headerName: 'เลขที่เอกสาร SD',
      minWidth: 180,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'startDate',
      headerName: 'วันที่โอนสินค้า',
      minWidth: 130,
      // flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      // renderCell: (params) => showDateTransfer(params),
      renderCell: (params) => (
        <div>
          <Typography variant="body2" sx={{ lineHeight: '120%' }}>
            {params.value}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: '120%' }}>
            {params.getValue(params.id, 'endDate') || ''}
          </Typography>
        </div>
      ),
    },
    {
      field: 'branchFrom',
      headerName: 'สาขาต้นทาง',
      minWidth: 128,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'branchTo',
      headerName: 'สาขาปลายทาง',
      minWidth: 128,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'createdBy',
      headerName: 'ผู้สร้างรายการ',
      minWidth: 80,
      flex: 0.75,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'สถานะ',
      minWidth: 80,
      flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
    },
    {
      field: 'button',
      headerName: ' ',
      width: 60,
      minWidth: 0,
      align: 'center',
      sortable: false,
      renderCell: () => {
        return <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />;
      },
    },
  ];

  const showDateTransfer = (params: GridValueGetterParams) => {
    let date1 = params.getValue(params.id, 'createdDate');
    let date2 = params.getValue(params.id, 'endDate');
    let resDate = (
      <div>
        {date1}
        {/* <Typography variant="body2" sx={{ lineHeight: '120%' }}>
          {date}
        </Typography> */}
        {/* <Typography color="textSecondary" variant="body2" sx={{ lineHeight: '120%' }}>
            {Number(params.getValue(params.id, 'lastModifiedDate')) || ''}
          </Typography> */}
      </div>
    );

    return resDate;
  };

  const rows = res.data.map((data: StockTransferInfo, indexs: number) => {
    return {
      id: data.id,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      btNo: data.btNo,
      sdNo: data.sdNo,
      startDate: convertUtcToBkkDate(data.startDate),
      // startDate: `${convertUtcToBkkDate(data.startDate)}-${convertUtcToBkkDate(data.startDate)}`,
      branchFrom: data.branchFrom,
      branchTo: data.branchTo,
      createdBy: data.createdBy,
      status: data.status,
      endDate: convertUtcToBkkDate(data.endDate),
    };
  });

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  // const currentlySelected = async (params: GridCellParams) => {
  //   handleOpenLoading('open', true);
  //   setidDC(params.row.id);

  //   try {
  //     await dispatch(featchorderDetailDCAsync(params.row.id));
  //     setOpensDCOrderDetail(true);
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   handleOpenLoading('open', false);
  // };

  // function isClosModal() {
  //   setOpensDCOrderDetail(false);
  // }

  const [loading, setLoading] = React.useState<boolean>(false);
  // const handlePageChange = async (newPage: number) => {
  //   setLoading(true);

  //   let page: string = (newPage + 1).toString();

  //   const payloadNewpage: CheckOrderRequest = {
  //     limit: pageSize,
  //     page: page,
  //     docNo: payload.docNo,
  //     branchCode: payload.branchCode,
  //     verifyDCStatus: payload.verifyDCStatus,
  //     dateFrom: payload.dateFrom,
  //     dateTo: payload.dateTo,
  //     sdType: payload.sdType,
  //     sortBy: payload.sortBy,
  //   };

  //   await dispatch(featchOrderListDcAsync(payloadNewpage));
  //   await dispatch(saveSearchCriteriaDc(payloadNewpage));
  //   setLoading(false);
  // };

  // const handlePageSizeChange = async (pageSize: number) => {
  //   // console.log("pageSize: ", pageSize);
  //   setPageSize(pageSize.toString());

  //   setLoading(true);

  //   const payloadNewpage: CheckOrderRequest = {
  //     limit: pageSize.toString(),
  //     // page: cuurentPages.toString(),
  //     page: '1',
  //     docNo: payload.docNo,
  //     branchCode: payload.branchCode,
  //     verifyDCStatus: payload.verifyDCStatus,
  //     dateFrom: payload.dateFrom,
  //     dateTo: payload.dateTo,
  //     sdType: payload.sdType,
  //     sortBy: payload.sortBy,
  //   };

  //   await dispatch(featchOrderListDcAsync(payloadNewpage));
  //   await dispatch(saveSearchCriteriaDc(payloadNewpage));

  //   setLoading(false);
  // };

  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            // onCellClick={currentlySelected}
            autoHeight={rows.length >= 10 ? false : true}
            scrollbarSize={10}
            pagination
            page={cuurentPage - 1}
            pageSize={parseInt(pageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={res.total}
            paginationMode="server"
            // onPageChange={handlePageChange}
            // onPageSizeChange={handlePageSizeChange}
            loading={loading}
            rowHeight={65}
          />
        </div>
      </Box>
      {/* {opensDCOrderDetail && <DCOrderDetail idDC={idDC} isOpen={opensDCOrderDetail} onClickClose={isClosModal} />} */}

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}

export default StockTransferList;
