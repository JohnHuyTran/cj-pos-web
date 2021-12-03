import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { CheckOrderResponse, CheckOrderInfo, CheckOrderRequest } from '../../models/dc-check-order-model';
import { featchOrderListDcAsync } from '../../store/slices/dc-check-order-slice';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { getSdType, getDCStatus } from '../../utils/utils';
import DCOrderDetail from './dc-ckeck-order-detail';
// import { makeStyles } from '@mui/styles';
import { useStyles } from '../../styles/makeTheme';
import Done from '@mui/icons-material/Done';
import { featchorderDetailDCAsync } from '../../store/slices/dc-check-order-detail-slice';
import LoadingModal from '../commons/ui/loading-modal';
import { PanoramaSharp } from '@mui/icons-material';
import { saveSearchCriteriaDc } from '../../store/slices/save-search-order-dc-slice';
import { Typography } from '@mui/material';
import { ShipmentRequest } from '../../models/order-model';
//import CheckOrderDetail from './check-order-detail';

interface loadingModalState {
  open: boolean;
}

function DCOrderList() {
  const classes = useStyles();
  // const classes = useStyles2();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.dcCheckOrderList);
  const cuurentPage = useAppSelector((state) => state.dcCheckOrderList.orderList.page);
  const limit = useAppSelector((state) => state.dcCheckOrderList.orderList.perPage);
  const res: CheckOrderResponse = items.orderList;
  const payload = useAppSelector((state) => state.saveSearchOrderDc.searchCriteriaDc);
  const [opensDCOrderDetail, setOpensDCOrderDetail] = React.useState(false);
  const [shipment, setShipment] = React.useState('');
  const [sdNo, setSdNo] = React.useState('');

  const [idDC, setidDC] = React.useState('');
  const [index, setIndex] = React.useState(1);
  const [currentpage, setCurrentpage] = React.useState(0);

  const [pageSize, setPageSize] = React.useState(limit.toString());
  // const [opens, setOpens] = React.useState(false);
  // const [shipment, setShipment] = React.useState("");
  // const [sdNo, setSdNo] = React.useState("");

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      width: 70,
      // flex: 0.7,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'shipmentNo',
      headerName: 'เลขที่เอกสาร LD',
      minWidth: 140,
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
      minWidth: 150,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'branchOutNo',
      headerName: 'เลขที่เอกสาร BO',
      minWidth: 128,
      // flex: 1.2,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'branchDesc',
      headerName: 'สาขาปลายทาง',
      minWidth: 150,
      flex: 0.9,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'sdType',
      headerName: 'ประเภท',
      minWidth: 80,
      flex: 0.75,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'verifyDCStatus',
      headerName: 'สถานะ',
      minWidth: 80,
      flex: 0.7,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
    },
    {
      field: 'hasBelow',
      headerName: 'ขาด',
      width: 65,
      // minWidth: 120,
      // flex: 0.8,
      headerAlign: 'center',
      sortable: false,
      align: 'center',
      renderCell: (params) => {
        if (params.value === true) {
          return <Done fontSize='small' sx={{ color: '#F54949' }} />;
        } else if (params.value === false) {
          return '-';
        }
      },
    },
    {
      field: 'hasOver',
      headerName: 'เกิน',
      width: 65,
      // minWidth: 120,
      // flex: 0.7,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (params.value === true) {
          return <Done fontSize='small' sx={{ color: '#F54949' }} />;
        } else if (params.value === false) {
          return '-';
        }
      },
    },
    {
      field: 'receivedDate',
      headerName: 'วันที่รับสินค้า',
      minWidth: 110,
      // flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
    },
    // { field: "detail", headerName: "รายละเอียด", minWidth: 200 },
  ];
  // console.log("Data Size: ", JSON.stringify(res));

  const rows = res.data.map((data: CheckOrderInfo, indexs: number) => {
    return {
      id: data.id,
      index: (cuurentPage - 1) * parseInt(pageSize) + indexs + 1,
      shipmentNo: data.shipmentNo,
      sdNo: data.sdNo,
      branchOutNo: data.branchOutNo,
      branchDesc: data.branchDesc,
      sdType: getSdType(data.sdType),
      verifyDCStatus: getDCStatus(data.verifyDCStatus),
      hasBelow: data.hasBelow,
      hasOver: data.hasOver,
      receivedDate: convertUtcToBkkDate(data.receivedDate),

      // sdType: getSdType(data.sdType),
      // sdStatus: getSdStatus(data.sdStatus),
    };
  });

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const currentlySelected = async (params: GridCellParams) => {
    handleOpenLoading('open', true);
    setidDC(params.row.id);

    try {
      await dispatch(featchorderDetailDCAsync(params.row.id));
      setOpensDCOrderDetail(true);
    } catch (error) {
      console.log(error);
    }

    handleOpenLoading('open', false);
  };

  function isClosModal() {
    setOpensDCOrderDetail(false);
  }

  const [loading, setLoading] = React.useState<boolean>(false);
  const handlePageChange = async (newPage: number) => {
    setLoading(true);

    let page: string = (newPage + 1).toString();

    const payloadNewpage: CheckOrderRequest = {
      limit: pageSize,
      page: page,
      docNo: payload.docNo,
      branchCode: payload.branchCode,
      verifyDCStatus: payload.verifyDCStatus,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      sdType: payload.sdType,
      sortBy: payload.sortBy,
    };

    await dispatch(featchOrderListDcAsync(payloadNewpage));
    await dispatch(saveSearchCriteriaDc(payloadNewpage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    // console.log("pageSize: ", pageSize);
    setPageSize(pageSize.toString());

    setLoading(true);

    const payloadNewpage: CheckOrderRequest = {
      limit: pageSize.toString(),
      // page: cuurentPages.toString(),
      page: '1',
      docNo: payload.docNo,
      branchCode: payload.branchCode,
      verifyDCStatus: payload.verifyDCStatus,
      dateFrom: payload.dateFrom,
      dateTo: payload.dateTo,
      sdType: payload.sdType,
      sortBy: payload.sortBy,
    };

    await dispatch(featchOrderListDcAsync(payloadNewpage));
    await dispatch(saveSearchCriteriaDc(payloadNewpage));

    setLoading(false);
  };

  return (
    <div>
      <Box mt={2} bgcolor='background.paper'>
        <div className={classes.MdataGridPaginationTop} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            onCellClick={currentlySelected}
            autoHeight={rows.length >= 10 ? false : true}
            scrollbarSize={10}
            pagination
            page={cuurentPage - 1}
            pageSize={parseInt(pageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={res.total}
            paginationMode='server'
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
            rowHeight={65}
          />
        </div>
      </Box>
      {opensDCOrderDetail && <DCOrderDetail idDC={idDC} isOpen={opensDCOrderDetail} onClickClose={isClosModal} />}

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}

export default DCOrderList;
