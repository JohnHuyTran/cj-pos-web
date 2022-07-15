import { Box, Typography } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useStyles } from '../../../styles/makeTheme';
import { useTranslation } from 'react-i18next';
import { Action, DateFormat, StockActionStatus } from '../../../utils/enum/common-enum';
import { objectNullOrEmpty, stringNullOrEmpty } from '../../../utils/utils';
import HtmlTooltip from '../../commons/ui/html-tooltip';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import { KeyCloakTokenInfo } from '../../../models/keycolak-token-info';
import { getUserInfo } from '../../../store/sessionStore';
import { TransferOut, TransferOutSearchRequest, TransferOutSearchResponse } from '../../../models/transfer-out-model';
import { getTransferOutDetail } from '../../../store/slices/transfer-out-detail-slice';
import { transferOutGetSearch } from '../../../store/slices/transfer-out-search-slice';
import { saveSearchCriteriaTO } from '../../../store/slices/transfer-out-criteria-search-slice';
import ModalCreateStockCount from "./modal-create-stock-count";
import { convertUtcToBkkDate } from "../../../utils/date-utill";

const _ = require('lodash');

interface loadingModalState {
  open: boolean;
}

interface StateProps {
  onSearch: () => void;
  type: string;
}

const StockCountList: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['barcodeDiscount']);
  const [lstTransferOut, setLstTransferOut] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({ open: false });
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);

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
          countingTimes: '',
          store: '',
          createdDate: convertUtcToBkkDate(data.createdDate, DateFormat.DATE_FORMAT),
          status: data.status,
          branch: stringNullOrEmpty(data.branch)
            ? stringNullOrEmpty(data.branchName)
              ? ''
              : data.branchName
            : data.branch + ' - ' + (stringNullOrEmpty(data.branchName) ? '' : data.branchName),
          creatorName: '',
        };
      });
      setLstTransferOut(rows);
      //permission
      const userInfo: KeyCloakTokenInfo = getUserInfo();
      if (!objectNullOrEmpty(userInfo) && !objectNullOrEmpty(userInfo.acl)) {
        setUserPermission(
          userInfo.acl['service.posback-stock'] != null && userInfo.acl['service.posback-stock'].length > 0
            ? userInfo.acl['service.posback-stock']
            : []
        );
      }
    }
  }, [toSearchResponse]);

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: t('numberOrder'),
      headerAlign: 'center',
      sortable: false,
      minWidth: 50,
      renderCell: (params) => (
        <Box component="div" sx={{ margin: '0 auto' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'documentNumber',
      headerName: 'เลขที่เอกสาร',
      headerAlign: 'center',
      sortable: false,
      minWidth: 180,
      width: 220,
    },
    {
      field: 'countingTimes',
      headerName: 'นับครั้งที่',
      headerAlign: 'center',
      sortable: false,
      minWidth: 80,
      width: 150,
    },
    {
      field: 'store',
      headerName: 'คลัง',
      headerAlign: 'center',
      sortable: false,
      minWidth: 100,
      width: 180,
    },
    {
      field: 'createdDate',
      headerName: 'วันที่ทำรายการ',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      minWidth: 120,
      width: 180,
      renderCell: (params) => (
        <Box component="div" sx={{ marginLeft: '0.2rem' }}>
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
      minWidth: 100,
      width: 150,
      renderCell: (params) => genRowStatus(params),
    },
    {
      field: 'branch',
      headerName: 'สาขาที่สร้างรายการ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 200,
      width: 280,
      renderCell: (params) => (
        <Box component="div" sx={{ marginLeft: '0 auto' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'creatorName',
      headerName: 'ผู้สร้างรายการ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 120,
      width: 220,
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
      case StockActionStatus.DRAFT:
        statusDisplay = genRowStatusValue('บันทึก', {
          color: '#FBA600',
          backgroundColor: '#FFF0CA',
        });
        break;
      case StockActionStatus.CONFIRM:
        statusDisplay = genRowStatusValue('ยืนยัน', {
          color: '#20AE79',
          backgroundColor: '#E7FFE9',
        });
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

    const payloadNewPage: TransferOutSearchRequest = {
      perPage: pageSize,
      page: page,
      query: payload.query,
      branch: payload.branch,
      status: payload.status,
      startDate: payload.startDate,
      endDate: payload.endDate,
    };

    await dispatch(transferOutGetSearch(payloadNewPage));
    await dispatch(saveSearchCriteriaTO(payloadNewPage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize.toString());
    setLoading(true);
    const payloadNewPage: TransferOutSearchRequest = {
      perPage: pageSize.toString(),
      page: '1',
      query: payload.query,
      branch: payload.branch,
      status: payload.status,
      startDate: payload.startDate,
      endDate: payload.endDate,
    };

    await dispatch(transferOutGetSearch(payloadNewPage));
    await dispatch(saveSearchCriteriaTO(payloadNewPage));
    setLoading(false);
  };

  const transferOutDetail = useAppSelector((state) => state.transferOutDetailSlice.transferOutDetail);
  const currentlySelected = async (params: GridCellParams) => {
    const chkPN = params.colDef.field;
    handleOpenLoading('open', true);
    if (chkPN !== 'checked') {
      try {
        await dispatch(getTransferOutDetail(params.row.documentNumber));
        if (transferOutDetail.data.length > 0 || transferOutDetail.data) {
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
            autoHeight={lstTransferOut.length < 10}
            onCellClick={currentlySelected}
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
        <ModalCreateStockCount
          isOpen={openDetail}
          onClickClose={handleCloseDetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          onSearchMain={props.onSearch}
          userPermission={userPermission}
        />
      )}
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
    </div>
  );
};

export default StockCountList;
