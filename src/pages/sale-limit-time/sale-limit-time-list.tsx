import { Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridCellParams, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { useStyles } from '../../styles/makeTheme';
import { genColumnValue, numberWithCommas, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action, STStatus, DateFormat } from '../../utils/enum/common-enum';
import HtmlTooltip from '../../components/commons/ui/html-tooltip';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updatePayloadST } from '../../store/slices/sale-limit-time-search-slice';
import ViewBranch from '../../components/sale-limit-time/view-branch';
import STCreateModal from '../../components/sale-limit-time/sale-limit-time-create-modal';
import moment from 'moment';
import { convertUtcToBkkDate } from '../../utils/date-utill';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';
import { getUserInfo } from '../../store/sessionStore';
import { getsaleLimitTimeDetail } from '../../store/slices/sale-limit-time-detail-slice';
import LoadingModal from '../../components/commons/ui/loading-modal';

const _ = require('lodash');
interface loadingModalState {
  open: boolean;
}
interface StateProps {
  onSearch: () => void;
}
const SaleLimitTimeList: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['saleLimitTime']);
  const [checkAll, setCheckAll] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [lstST, setListST] = React.useState<any[]>([]);
  const responveST = useAppSelector((state) => state.searchSaleLimitTime.responseST);
  const payloadST = useAppSelector((state) => state.searchSaleLimitTime.payloadST);
  const saleLimitTimeDetail = useAppSelector((state) => state.saleLimitTimeDetailSlice.saleLimitTimeDetail);
  const currentPage = responveST.page;
  const limit = responveST.perPage;
  const [pageSize, setPageSize] = React.useState(limit.toString());

  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [openDetailModal, setOpenDetailModal] = React.useState(false);
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({ open: false });
  const [isAdmin, setIsAdmin] = React.useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const list: any[] = responveST.data;
    if (list != null) {
      let rows = list.map((item: any, index: number) => {
        return {
          checked: false,
          id: item.id,
          index: index + 1,
          documentNumber: item.documentNumber,
          status: item.status,
          description: item.description,
          remark: item.remark,
          stStartTime: item.stStartTime,
          stEndTime: item.stEndTime,
          branch: item.stDetail,
        };
      });
      setListST(rows);
    }
  }, [responveST]);

  useEffect(() => {
    const userInfo: KeyCloakTokenInfo = getUserInfo();
    if (!objectNullOrEmpty(userInfo) && !objectNullOrEmpty(userInfo.acl)) {
      setIsAdmin(userInfo.acl['service.posback-campaign'].includes('campaign.st.create'));
    }
  }, []);

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };
  const columns: GridColDef[] = [
    // {
    //   field: 'checked',
    //   headerName: t('numberOrder'),
    //   width: 100,
    //   headerAlign: 'center',
    //   align: 'center',
    //   sortable: false,
    //   renderHeader: (params) => (
    //     <FormControl component="fieldset" sx={{ marginLeft: '-15px' }}>
    //       <FormGroup aria-label="position" row>
    //         <FormControlLabel
    //           className={classes.MFormControlLabel}
    //           value="top"
    //           control={<Checkbox checked={checkAll} />}
    //           label={t('selectAll')}
    //           labelPlacement="top"
    //         />
    //       </FormGroup>
    //     </FormControl>
    //   ),
    //   renderCell: (params) => (
    //     <Checkbox checked={Boolean(params.value)} disabled={BDStatus.APPROVED != params.row.status} />
    //   ),
    // },
    {
      field: 'index',
      headerName: 'ลำดับ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 70,
    },
    {
      field: 'documentNumber',
      headerName: 'เลขที่เอกสาร PI',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
    },
    {
      field: 'status',
      headerName: 'สถานะ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
      renderCell: (params) => genRowStatus(params),
    },
    {
      field: 'description',
      headerName: 'รายละเอียด',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
      renderCell: (params) => renderCell(params.value),
    },
    {
      field: 'branch',
      headerName: 'สาขา',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
      renderCell: (params) => genBranch(params),
    },
    {
      field: 'createdAt',
      headerName: 'วันที่สร้าง รายการ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 160,
    },
    {
      field: 'stStartTime',
      headerName: 'วัน/เวลา ที่เริ่ม',
      headerAlign: 'center',
      sortable: false,
      minWidth: 160,
      renderCell: (params) => {
        const start = params.value?.toString();
        return (
          <div>
            <Typography variant="body2" noWrap>
              {moment(start).add(543, 'year').format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="body2" noWrap>
              {moment(start).format('HH:mm ')}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'stEndTime',
      headerName: 'วัน/เวลา ที่สิ้นสุด',
      headerAlign: 'center',
      sortable: false,
      minWidth: 160,
      renderCell: (params) => {
        const end = params.value?.toString();
        return (
          <div>
            <Typography variant="body2" noWrap>
              {moment(end).add(543, 'year').format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="body2" noWrap>
              {moment(end).format('HH:mm ')}
            </Typography>
          </div>
        );
      },
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
      renderCell: (params) => renderCell(params.value),
    },
  ];

  const renderCell = (value: any) => {
    return (
      <HtmlTooltip title={<React.Fragment>{value}</React.Fragment>}>
        <Typography variant="body2" noWrap>
          {value}
        </Typography>
      </HtmlTooltip>
    );
  };

  const genBranch = (params: GridValueGetterParams) => {
    const branch = _.cloneDeep(params.value);
    return <ViewBranch values={branch} />;
  };

  const genRowStatusValue = (statusLabel: string, styleCustom: any) => {
    return (
      <HtmlTooltip title={<React.Fragment>{statusLabel}</React.Fragment>}>
        <Typography className={classes.MLabelBDStatus} sx={styleCustom}>
          {statusLabel}
        </Typography>
      </HtmlTooltip>
    );
  };

  const genRowStatus = (params: GridValueGetterParams) => {
    let statusDisplay;
    let status = params.value ? params.value.toString() : '';
    const statusLabel = genColumnValue('label', 'value', status, t('lstStatus', { returnObjects: true }));

    switch (status) {
      case STStatus.DRAFT:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#FBA600', backgroundColor: '#FFF0CA' });
        break;
      case STStatus.START:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#36C690', backgroundColor: '#E7FFE9' });
        break;
      case STStatus.END:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#676767', backgroundColor: '#EAEBEB;' });
        break;
      case STStatus.CANCEL:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#F54949', backgroundColor: '#FFD7D7' });
        break;
    }
    return statusDisplay;
  };
  const handlePageChange = (newPage: number) => {
    let page: string = (newPage + 1).toString();
    const newPayload = {
      ...payloadST,
      page: page,
    };
    dispatch(updatePayloadST(newPayload));
  };
  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize.toString());
    const newPayload = {
      ...payloadST,
      perPage: pageSize,
    };
    dispatch(updatePayloadST(newPayload));
  };
  const handleCloseCreateModal = () => {
    props.onSearch();
    setOpenDetailModal(false);
  };

  const handleClickCell = async (params: GridCellParams) => {
    // const chkPN = params.colDef.field;
    handleOpenLoading('open', true);
    try {
      await dispatch(getsaleLimitTimeDetail(params.row.id));
      if (saleLimitTimeDetail.data.length > 0 || saleLimitTimeDetail.data) {
        console.log(saleLimitTimeDetail);
        props.onSearch();
        setOpenDetailModal(true);
      }
    } catch (error) {
      console.log(error);
    }

    handleOpenLoading('close', false);
  };

  return (
    <>
      <div
        className={classes.MdataGridPaginationTop}
        style={{ height: lstST.length <= 10 ? '60vh' : 'auto', width: '100%' }}
      >
        <DataGrid
          columns={columns}
          rows={lstST}
          pagination
          page={currentPage - 1}
          pageSize={parseInt(pageSize)}
          rowCount={responveST.total}
          rowHeight={45}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onCellClick={handleClickCell}
        />
      </div>
      {openDetailModal && (
        <STCreateModal
          type={'Detail'}
          isAdmin={isAdmin}
          setOpenPopup={setOpenPopup}
          setPopupMsg={setPopupMsg}
          isOpen={openDetailModal}
          onClickClose={handleCloseCreateModal}
        />
      )}
      <LoadingModal open={openLoadingModal.open} />
    </>
  );
};
export default SaleLimitTimeList;
