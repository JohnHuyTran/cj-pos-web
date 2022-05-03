import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { MoreVertOutlined } from '@mui/icons-material';

import store, { useAppSelector, useAppDispatch } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import {
  Barcode,
  OutstandingRequest,
  StockInfo,
  StockMomentInfoType,
  StockMovementMasterInfo,
} from '../../../models/stock-model';
import {
  featchStockMovementeSearchAsync,
  savePayloadSearch,
} from '../../../store/slices/stock/stock-movement-search-slice';
import StockMovementTransaction from './stock-movement-transaction';
import CheckOrderDetail from '../../check-orders/check-order-detail';
import { featchOrderDetailAsync } from '../../../store/slices/check-order-detail-slice';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { isShowMovementDetail } from '../../../utils/enum/stock-enum';
import AlertError from '../../commons/ui/alert-error';
import { isErrorCode } from '../../../utils/exception/pos-exception';

function StockMovementSearchList() {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'error']);
  const masterStockMovementType = useAppSelector(
    (state) => state.masterStockMovementTypeSlice.masterStockMovementType.data
  );
  const savePayLoadSearch = useAppSelector((state) => state.stockMovementSearchSlice.savePayloadSearch);
  const items = useAppSelector((state) => state.stockMovementSearchSlice.stockList);
  const cuurentPage = useAppSelector((state) => state.stockMovementSearchSlice.stockList.page);
  const limit = useAppSelector((state) => state.stockMovementSearchSlice.stockList.perPage);
  const [pageSize, setPageSize] = React.useState(limit);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [textError, setTextError] = React.useState('');

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const [openModalTransaction, setOpenModalTransaction] = React.useState(false);
  const [movementTransaction, setMovementTransaction] = React.useState<Barcode[]>([]);
  const [docNo, setDocNo] = React.useState<string>('');
  const [docRefNo, setDocRefNo] = React.useState<string>('');
  const [docType, setDocType] = React.useState<string>('');

  const handleModelAction = (params: GridRenderCellParams) => {
    const barcodes: any = params.getValue(params.id, 'barcodes');

    const handleOpenModalTransaction = () => {
      setMovementTransaction(barcodes);
      setOpenModalTransaction(true);
    };
    return (
      <>
        <Button onClick={handleOpenModalTransaction}>
          <MoreVertOutlined sx={{ color: '#263238' }} />
        </Button>
      </>
    );
  };

  const handleCloseModalTransaction = () => {
    setOpenModalTransaction(false);
  };

  const getMovementType = (key: string) =>
    masterStockMovementType.find((item: StockMovementMasterInfo) => item.code === key);

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ลำดับ',
      width: 70,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box component='div' sx={{ paddingLeft: '20px' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'createDate',
      headerClassName: 'columnHeaderTitle',
      headerName: 'วันที่ทำรายการ',
      minWidth: 150,
      flex: 0.5,
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => {
        const date = params.value?.toString();
        return (
          <div>
            <Typography variant='body2' noWrap>
              {`${moment(date).add(543, 'year').format('DD/MM/YYYY')} ${moment(date).format('HH:mm ')}`}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'docNo',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขที่เอกสาร',
      headerAlign: 'center',
      flex: 0.5,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => {
        const docNo: string =
          params.getValue(params.id, 'docNo') && params.getValue(params.id, 'docNo') !== undefined
            ? String(params.getValue(params.id, 'docNo'))
            : '';
        const docRef: string =
          params.getValue(params.id, 'docRefNo') && params.getValue(params.id, 'docRefNo') !== undefined
            ? String(params.getValue(params.id, 'docRefNo'))
            : '';
        const docType: string =
          params.getValue(params.id, 'docType') && params.getValue(params.id, 'docType') !== undefined
            ? String(params.getValue(params.id, 'docType'))
            : '';
        if (params.getValue(params.id, 'movementAction') === true && docNo) {
          return (
            <Typography
              color='secondary'
              variant='body2'
              sx={{ textDecoration: 'underline' }}
              onClick={() => showDocumentDetail(docNo, docRef, docType)}>
              {params.value}
            </Typography>
          );
        } else {
          return <Typography>{params.value}</Typography>;
        }
      },
    },
    {
      field: 'docRefNo',
      headerClassName: 'columnHeaderTitle',
      headerName: 'เลขที่เอกสารอ้างอิง',
      minWidth: 100,
      flex: 0.5,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'locationCode',
      headerClassName: 'columnHeaderTitle',
      headerName: 'คลัง',
      minWidth: 85,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'movementTypeName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'ประเภท',
      minWidth: 150,
      flex: 0.8,
      headerAlign: 'center',
      align: 'left',
      sortable: false,
    },
    {
      field: 'movementQty',
      headerClassName: 'columnHeaderTitle',
      headerName: 'จำนวนที่ทำรายการ',
      width: 100,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'balanceQty',
      headerClassName: 'columnHeaderTitle-BG',
      cellClassName: 'columnFilled-BG',
      headerName: 'สินค้าคงเหลือ',
      minWidth: 100,
      headerAlign: 'center',
      align: 'right',
      sortable: false,
    },
    {
      field: 'unitName',
      headerClassName: 'columnHeaderTitle',
      headerName: 'หน่วย',
      width: 75,
      headerAlign: 'center',
      sortable: false,
    },
    {
      field: 'action',
      headerName: ' ',
      width: 40,
      align: 'center',
      sortable: false,
      renderCell: (params) => handleModelAction(params),
    },
  ];

  const rows = items.data.map((data: StockMomentInfoType, indexs: number) => {
    const movementType = getMovementType(data.movementTypeCode);
    return {
      id: indexs,
      index: (cuurentPage - 1) * Number(pageSize) + indexs + 1,
      createDate: data.movementDate,
      docNo: data.docNo ? data.docNo : '',
      docRefNo: data.docRefNo,
      locationCode: t(`stock.location.${data.locationCode}`),
      movementTypeName: movementType?.nameTH,
      movementTypeCode: data.movementTypeCode,
      movementQty: data.movementQty,
      balanceQty: data.balanceQty,
      unitName: data.unitName,
      movementAction: isShowMovementDetail(data.movementTypeCode),
      barcodes: data.barcodes,
      docType: movementType?.docType,
    };
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const handlePageChange = async (newPage: number) => {
    setLoading(true);

    let page: number = newPage + 1;

    const payloadNewpage: OutstandingRequest = {
      limit: pageSize,
      page: page,
      branchCode: savePayLoadSearch.branchCode,
      dateFrom: savePayLoadSearch.dateFrom,
      skuCodes: savePayLoadSearch.skuCodes,
      locationCode: savePayLoadSearch.locationCode,
    };

    await dispatch(featchStockMovementeSearchAsync(payloadNewpage));
    await dispatch(savePayloadSearch(payloadNewpage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize);
    setLoading(true);

    const payloadNewpage: OutstandingRequest = {
      limit: pageSize,
      page: 1,
      branchCode: savePayLoadSearch.branchCode,
      dateFrom: savePayLoadSearch.dateFrom,
      skuCodes: savePayLoadSearch.skuCodes,
      locationCode: savePayLoadSearch.locationCode,
    };
    await dispatch(featchStockMovementeSearchAsync(payloadNewpage));
    await dispatch(savePayloadSearch(payloadNewpage));
    setLoading(false);
  };

  const currentlySelected = async (params: GridCellParams) => {
    if (params.field === 'docNo') {
    }
  };

  const showDocumentDetail = async (docNo: string, docRefNo: string, docType: string) => {
    if (docType === 'LD') {
      setDocNo(docNo);
      setDocRefNo(docRefNo);
      setDocType(docType);
      await dispatch(featchOrderDetailAsync(docNo))
        .then((value: any) => {
          if (value) {
            if (isErrorCode(value.payload.code)) {
              setOpenAlert(true);
              setTextError('ไม่พบข้อมูล');
            } else {
              handleOpenModalDocDetail();
            }
          }
        })
        .catch((err) => {
          setOpenAlert(true);
          setTextError('พบข้อผิดพลาด\nกรุณาลองใหม่อีกครั้ง');
        });
    }
  };

  const [openModalDocDetail, setOpenModalDocDetail] = React.useState(false);
  const handleOpenModalDocDetail = () => {
    setOpenModalDocDetail(true);
  };
  const handleCloseModalDocDetail = () => {
    setOpenModalDocDetail(false);
  };
  return (
    <React.Fragment>
      <Box
        mt={2}
        bgcolor='background.paper'
        sx={{
          '& .columnHeaderTitle-BG': {
            backgroundColor: '#20AE79',
            color: '#FFFFFF !important',
          },
          '& .columnHeaderTitle': {
            color: '#20AE79 !important',
          },
          '& .columnFilled-BG': {
            backgroundColor: '#E7FFE9',
          },
        }}>
        <div className={classes.MdataGridPaginationTopStock} style={{ height: rows.length >= 10 ? '80vh' : 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            autoHeight={rows.length >= 10 ? false : true}
            scrollbarSize={10}
            pagination
            page={cuurentPage - 1}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={items.total}
            paginationMode='server'
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onCellClick={currentlySelected}
            loading={loading}
            rowHeight={65}
          />
        </div>
      </Box>
      <StockMovementTransaction
        open={openModalTransaction}
        onClose={handleCloseModalTransaction}
        movementTransaction={movementTransaction}
      />
      {openModalDocDetail && (
        <CheckOrderDetail
          sdNo={docNo}
          docRefNo={docRefNo}
          docType={docType}
          defaultOpen={openModalDocDetail}
          onClickClose={handleCloseModalDocDetail}
        />
      )}

      <AlertError open={openAlert} onClose={handleCloseAlert} textError={textError} />
    </React.Fragment>
  );
}

export default StockMovementSearchList;