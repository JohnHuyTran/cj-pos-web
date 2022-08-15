import { Box, Typography,Checkbox } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useStyles } from '../../../styles/makeTheme';
import { useTranslation } from 'react-i18next';
import { Action, DateFormat, StockActionStatus, STORE_TYPE } from '../../../utils/enum/common-enum';
import { KEYCLOAK_GROUP_AUDIT } from "../../../utils/enum/permission-enum";
import { objectNullOrEmpty, stringNullOrEmpty,numberWithCommas } from '../../../utils/utils';
import HtmlTooltip from '../../commons/ui/html-tooltip';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import SnackbarStatus from '../../commons/ui/snackbar-status';
import { KeyCloakTokenInfo } from '../../../models/keycolak-token-info';
import { getUserInfo } from '../../../store/sessionStore';
import { convertUtcToBkkDate } from "../../../utils/date-utill";
import { AuditHistory, AuditHistorySearchRequest, AuditHistorySearchResponse } from "../../../models/audit-history-model";
import { getAuditHistorySearch } from "../../../store/slices/audit-history-search-slice";
import { saveSearchCriteriaAH } from "../../../store/slices/audit-history-criteria-search-slice";
const _ = require('lodash');

interface loadingModalState {
  open: boolean;
}

interface StateProps {
  onSearch: () => void;
  type: string;
}

const AuditHistoryList: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['barcodeDiscount']);
  const [lstAuditHistory, setLstAuditHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({ open: false });
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const auditHistorySearchSlice = useAppSelector((state) => state.auditHistorySearchSlice);
  const toSearchResponse: AuditHistorySearchResponse = auditHistorySearchSlice.toSearchResponse;
  const currentPage = useAppSelector((state) => state.auditHistorySearchSlice.toSearchResponse.page);
  const limit = useAppSelector((state) => state.auditHistorySearchSlice.toSearchResponse.perPage);
  const [pageSize, setPageSize] = React.useState(limit.toString());
  const payload = useAppSelector((state) => state.auditHistoryCriteriaSearchSlice.searchCriteria);
  const [userPermission, setUserPermission] = useState<any[]>([]);
  const userInfo = getUserInfo();
  const [auditPermission, setAuditPermission] = useState<boolean>((userInfo && userInfo.groups && userInfo.groups.length > 0)
    ? userInfo.groups.includes(KEYCLOAK_GROUP_AUDIT) : false);

  useEffect(() => {
    const lstAuditHistory = toSearchResponse.data;
    if (lstAuditHistory != null && lstAuditHistory.length > 0) {
      let rows = lstAuditHistory.map((data: AuditHistory, index: number) => {
        return {
          id: data.id,
          index: (currentPage - 1) * parseInt(pageSize) + index + 1,
          documentNumber: data.documentNumber,
          createdDate: convertUtcToBkkDate(data.createdDate, DateFormat.DATE_FORMAT),
          status: data.status,
          branch: stringNullOrEmpty(data.branchCode)
            ? stringNullOrEmpty(data.branchName)
              ? ''
              : data.branchName
            : data.branchCode + ' - ' + (stringNullOrEmpty(data.branchName) ? '' : data.branchName),
          createdBy: data.createdBy,
          APId: data.APId,
          APDocumentNumber: data.APDocumentNumber,
        };
      });
      setLstAuditHistory(rows);
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
        field: 'checked',
        headerName: 'ไม่สามารถนับได้',
        flex: 0.6,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: (params) => (
          <Checkbox
            checked={Boolean(params.value)}
            // disabled={!auditPermission || stringNullOrEmpty(dataDetail.status) || dataDetail.status != StockActionStatus.DRAFT}
            // onClick={onCheckCell.bind(this, params)}
          />
        ),
    },
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
        field: 'skuName',
        headerName: 'รายละเอียดสินค้า',
        flex: 2,
        headerAlign: 'center',
        disableColumnMenu: false,
        sortable: false,
        renderCell: (params) => (
          <div>
            <Typography variant="body2">{params.value}</Typography>
            <Typography color="textSecondary" sx={{ fontSize: 12 }}>
              {params.getValue(params.id, 'sku') || ''}
            </Typography>
          </div>
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
        field: 'difference',
        headerName: 'ผลต่างการนับ',
        flex: 1,
        headerAlign: 'center',
        align: 'right',
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => genDifferenceCount(
          params.getValue(params.id, 'checked') ? Boolean(params.getValue(params.id, 'checked')) : false,
          Number(params.value)),
    },
    {
        field: 'noAdjustedStock',
        headerName: 'จำนวนที่ปรับสต๊อก',
        flex: 1,
        headerAlign: 'center',
        align: 'right',
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => genDifferenceCount(
          params.getValue(params.id, 'checked') ? Boolean(params.getValue(params.id, 'checked')) : false,
          Number(params.value)),
    },
    {
        field: 'unitName',
        headerName: 'หน่วย',
        flex: 0.6,
        headerAlign: 'center',
        disableColumnMenu: true,
        sortable: false,
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
        field: 'createdBy',
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
    {
      field: 'remark',
      headerName: t('status'),
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      minWidth: 100,
      width: 150,
      renderCell: (params) => genRowStatus(params),
    },
    
  ];

  const genDifferenceCount = (checked: boolean, value: number) => {
    let colorValue: string = '#263238';
    if (value < 0) {
      colorValue = '#F54949';
    } else if (value > 0) {
      colorValue = '#446EF2';
    }
    return <Typography variant='body2' sx={{ color: colorValue }}>{numberWithCommas(value)}</Typography>;
  };

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

    const payloadNewPage: AuditHistorySearchRequest = {
      perPage: pageSize,
      page: page,
      docNo: payload.docNo,
      skuName: payload.skuName,
      branch: payload.branch,
      status: payload.status,
      creationDateFrom: payload.creationDateFrom,
      creationDateTo: payload.creationDateTo,
    };

    await dispatch(getAuditHistorySearch(payloadNewPage));
    await dispatch(saveSearchCriteriaAH(payloadNewPage));
    setLoading(false);
  };

  const handlePageSizeChange = async (pageSize: number) => {
    setPageSize(pageSize.toString());
    setLoading(true);
    const payloadNewPage: AuditHistorySearchRequest = {
      perPage: pageSize.toString(),
      page: '1',
      docNo: payload.docNo,
      skuName: payload.skuName,
      branch: payload.branch,
      status: payload.status,
      creationDateFrom: payload.creationDateFrom,
      creationDateTo: payload.creationDateTo,
    };

    await dispatch(getAuditHistorySearch(payloadNewPage));
    await dispatch(saveSearchCriteriaAH(payloadNewPage));
    setLoading(false);
  };

  const onSearchAgain = async () => {
    const payloadNew: AuditHistorySearchRequest = {
      perPage: payload.perPage,
      page: payload.page,
      docNo: payload.docNo,
      skuName : payload.skuName,
      branch: payload.branch,
      status: payload.status,
      creationDateFrom: payload.creationDateFrom,
      creationDateTo: payload.creationDateTo,
    };
    await dispatch(getAuditHistorySearch(payloadNew));
  };

  const stockAdjustDetail = useAppSelector((state) => state.stockAdjustmentDetailSlice.stockAdjustDetail);
//   const currentlySelected = async (params: GridCellParams) => {
//     const chkPN = params.colDef.field;
//     handleOpenLoading('open', true);
//     if (chkPN !== 'checked') {
//       try {
//         await dispatch(getAuditPlanDetail(params.row.APId));
//         await dispatch(getStockAdjustmentDetail(params.row.id));
//         if (stockAdjustDetail) {
//             setOpenDetail(true);
//             await dispatch(updateRefresh(true));
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     handleOpenLoading('open', false);
//   };

  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <div
          className={classes.MdataGridPaginationTop}
          style={{ height: lstAuditHistory.length >= 10 ? '60vh' : 'auto' }}
        >
          <DataGrid
            rows={lstAuditHistory}
            columns={columns}
            disableColumnMenu
            hideFooterSelectedRowCount={true}
            autoHeight={lstAuditHistory.length < 10}
            // onCellClick={currentlySelected}
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
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
    </div>
  );
};

export default AuditHistoryList;
