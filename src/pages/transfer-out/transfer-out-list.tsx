import { Box, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useStyles } from '../../styles/makeTheme';
import { useTranslation } from 'react-i18next';
import {
  BarcodeDiscount,
  BarcodeDiscountProductDetail,
  BarcodeDiscountSearchRequest,
  BarcodeDiscountSearchResponse,
} from '../../models/barcode-discount-model';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { Action, BDStatus, DateFormat, TOStatus } from '../../utils/enum/common-enum';
import { genColumnValue, numberWithCommas, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import HtmlTooltip from '../../components/commons/ui/html-tooltip';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { saveSearchCriteriaSup } from '../../store/slices/save-search-order-supplier-slice';
import { barcodeDiscountSearch } from '../../store/slices/barcode-discount-search-slice';
import ModalCreateBarcodeDiscount from '../../components/barcode-discount/modal-create-barcode-discount';
import { getBarcodeDiscountDetail } from '../../store/slices/barcode-discount-detail-slice';
import SnackbarStatus from '../../components/commons/ui/snackbar-status';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';
import { getUserInfo } from '../../store/sessionStore';
import { updateBarcodeDiscountPrintState, updatePrintInDetail } from '../../store/slices/barcode-discount-print-slice';
import moment from 'moment';
import { TransferOut, TransferOutSearchResponse } from '../../models/transfer-out-model';

const _ = require('lodash');

interface loadingModalState {
  open: boolean;
}

interface StateProps {
  onSearch: () => void;
}

const TransferOutList: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['barcodeDiscount']);
  const [lstTransferOut, setLstTransferOut] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({ open: false });
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [checkAll, setCheckAll] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const transferOuttSearchSlice = useAppSelector((state) => state.transferOutSearchSlice);
  const toSearchResponse: TransferOutSearchResponse = transferOuttSearchSlice.toSearchResponse;
  const currentPage = useAppSelector((state) => state.transferOutSearchSlice.toSearchResponse.page);
  const limit = useAppSelector((state) => state.transferOutSearchSlice.toSearchResponse.perPage);
  const [pageSize, setPageSize] = React.useState(limit.toString());
  const payload = useAppSelector((state) => state.transferOutCriterSearchSlice.searchCriteria);
  const [userPermission, setUserPermission] = useState<any[]>([]);

  useEffect(() => {
    const lstTransferOut = toSearchResponse.data;
    if (lstTransferOut != null && lstTransferOut.length > 0) {
      let rows = lstTransferOut.map((data: TransferOut, index: number) => {
        return {
          id: data.id,
          index: (currentPage - 1) * parseInt(pageSize) + index + 1,
          documentNumber: data.documentNumber,
          status: genStatusIncludeExpiredCase(data),
          transactionDate: convertUtcToBkkDate(data.createdDate, DateFormat.DATE_FORMAT),
          approvalDate: stringNullOrEmpty(data.approvedDate)
            ? ''
            : convertUtcToBkkDate(data.approvedDate, DateFormat.DATE_FORMAT),
          products: data.products,
          requestorName: '',
          approverName: '',
        };
      });
      setLstTransferOut(rows);
      setCheckAll(false);
      //permission
      const userInfo: KeyCloakTokenInfo = getUserInfo();
      if (!objectNullOrEmpty(userInfo) && !objectNullOrEmpty(userInfo.acl)) {
        setUserPermission(
          userInfo.acl['service.posback-campaign'] != null && userInfo.acl['service.posback-campaign'].length > 0
            ? userInfo.acl['service.posback-campaign']
            : []
        );
      }
    }
  }, [toSearchResponse]);

  const genStatusIncludeExpiredCase = (rowData: any) => {
    let status = rowData.status;
    if (
      rowData.products &&
      rowData.products.length > 0 &&
      (Number(BDStatus.APPROVED) == rowData.status || Number(BDStatus.BARCODE_PRINTED) == rowData.status)
    ) {
      let productPassValidation = rowData.products.filter(
        (itPro: any) =>
          itPro.numberOfApproved > 0 &&
          !stringNullOrEmpty(itPro.expiredDate) &&
          moment(itPro.expiredDate).isSameOrAfter(moment(new Date()), 'day')
      );
      if (productPassValidation.length === 0) {
        status = Number(BDStatus.ALREADY_EXPIRED);
      }
    }
    return status;
  };

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const renderCell = (value: any) => {
    return (
      <HtmlTooltip title={<React.Fragment>{value}</React.Fragment>}>
        <Typography variant="body2" noWrap>
          {value}
        </Typography>
      </HtmlTooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: t('numberOrder'),
      headerAlign: 'center',
      sortable: false,
      flex: 0.5,
      renderCell: (params) => (
        <Box component="div" sx={{ margin: '0 auto' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'documentNumber',
      headerName: 'เอกสารเบิก',
      headerAlign: 'center',
      sortable: false,
      flex: 1.5,
    },
    {
      field: 'transactionDate',
      headerName: 'วันที่ทำรายการ',
      headerAlign: 'center',
      sortable: false,
      flex: 0.9,
      renderCell: (params) => (
        <Box component="div" sx={{ marginLeft: '1rem' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'approvalDate',
      headerName: 'วันที่อนุมัติ',
      headerAlign: 'center',
      sortable: false,
      flex: 0.9,
      renderCell: (params) => (
        <Box component="div" sx={{ marginLeft: '1rem' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: t('status'),
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 0.8,
      renderCell: (params) => genRowStatus(params),
    },
    {
      field: 'requestorName',
      headerName: 'ผู้บันทึก',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box component="div" sx={{ marginLeft: '1rem' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'approverName',
      headerName: 'ผู้อนุมัติ',
      headerAlign: 'center',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box component="div" sx={{ marginLeft: '1rem' }}>
          {params.value}
        </Box>
      ),
    },
  ];
  const genRowStatus = (params: GridValueGetterParams) => {
    let statusDisplay;
    let status = params.value ? params.value.toString() : '';
    switch (status) {
      case TOStatus.DRAFT:
        statusDisplay = genRowStatusValue('บันทึก', { color: '#FBA600', backgroundColor: '#FFF0CA' });
        break;
      case TOStatus.WAIT_FOR_APPROVAL:
        statusDisplay = genRowStatusValue('รออนุมัติ', { color: '#FBA600', backgroundColor: '#FFF0CA' });
        break;
      case TOStatus.APPROVED:
        statusDisplay = genRowStatusValue('อนุมัติ', { color: '#20AE79', backgroundColor: '#E7FFE9' });
        break;
      case TOStatus.REJECTED:
        statusDisplay = genRowStatusValue('ไม่อนุมัติ', { color: '#F54949', backgroundColor: '#FFD7D7' });
        break;
      case TOStatus.CLOSED:
        statusDisplay = genRowStatusValue('ปิดงาน', { color: '#676767', backgroundColor: '#EAEBEB' });
        break;
    }
    return statusDisplay;
  };

  const genRowStatusValue = (statusLabel: any, styleCustom: any) => {
    return (
      <HtmlTooltip title={<React.Fragment>{statusLabel}</React.Fragment>}>
        <Typography className={classes.MLabelBDStatus} sx={styleCustom}>
          {statusLabel}
        </Typography>
      </HtmlTooltip>
    );
  };

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    let page: string = (newPage + 1).toString();

    const payloadNewPage: BarcodeDiscountSearchRequest = {
      perPage: pageSize,
      page: page,
      query: payload.query,
      branch: payload.branch,
      status: payload.status,
      startDate: payload.startDate,
      endDate: payload.endDate,
    };

    await dispatch(barcodeDiscountSearch(payloadNewPage));
    await dispatch(saveSearchCriteriaSup(payloadNewPage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize.toString());
    setLoading(true);
    const payloadNewPage: BarcodeDiscountSearchRequest = {
      perPage: pageSize.toString(),
      page: '1',
      query: payload.query,
      branch: payload.branch,
      status: payload.status,
      startDate: payload.startDate,
      endDate: payload.endDate,
    };

    await dispatch(barcodeDiscountSearch(payloadNewPage));
    await dispatch(saveSearchCriteriaSup(payloadNewPage));
    setLoading(false);
  };

  const barcodeDiscountDetail = useAppSelector((state) => state.barcodeDiscountDetailSlice.barcodeDiscountDetail);
  const currentlySelected = async (params: GridCellParams) => {
    const chkPN = params.colDef.field;
    handleOpenLoading('open', true);
    if (chkPN !== 'checked') {
      try {
        await dispatch(getBarcodeDiscountDetail(params.row.id));
        if (barcodeDiscountDetail.data.length > 0 || barcodeDiscountDetail.data) {
          setOpenDetail(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    handleOpenLoading('open', false);
  };

  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <div
          className={classes.MdataGridPaginationTop}
          style={{ height: lstTransferOut.length >= 10 ? '60vh' : 'auto' }}
        >
          <DataGrid
            rows={lstTransferOut}
            columns={columns}
            disableColumnMenu
            hideFooterSelectedRowCount={true}
            // onCellClick={currentlySelected}
            autoHeight={lstTransferOut.length < 10}
            scrollbarSize={10}
            pagination
            page={currentPage - 1}
            pageSize={parseInt(pageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            rowCount={toSearchResponse.total}
            paginationMode="server"
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
            rowHeight={45}
          />
        </div>
      </Box>
      {openDetail && (
        <ModalCreateBarcodeDiscount
          isOpen={openDetail}
          onClickClose={handleCloseDetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          onSearchBD={props.onSearch}
          userPermission={userPermission}
        />
      )}
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
    </div>
  );
};

export default TransferOutList;
