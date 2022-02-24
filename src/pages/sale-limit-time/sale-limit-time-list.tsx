import { Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { useStyles } from '../../styles/makeTheme';
import { genColumnValue, numberWithCommas, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action, BDStatus, DateFormat } from '../../utils/enum/common-enum';
import HtmlTooltip from '../../components/commons/ui/html-tooltip';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updatePayloadST } from '../../store/slices/sale-limit-time-search-slice';
import moment from 'moment';
import STCreateModal from '../../components/sale-limit-time/sale-limit-time-create-modal';

interface StateProps {
  onSearch: () => void;
}
const SaleLimitTimeList: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['barcodeDiscount']);
  const [checkAll, setCheckAll] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [lstST, setListST] = React.useState<any[]>([]);
  const responveST = useAppSelector((state) => state.searchSaleLimitTime.responseST);
  const payloadST = useAppSelector((state) => state.searchSaleLimitTime.payloadST);
  const currentPage = responveST.page;
  const limit = responveST.perPage;
  const [pageSize, setPageSize] = React.useState(limit.toString());

  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const list: any[] = responveST.data;
    if (list != null) {
      let rows = list.map((item: any, index: number) => {
        return {
          checked: false,
          id: item.id,
          index: index,
          documentNumber: item.documentNumber,
          status: item.status,
          description: item.description,
          remark: item.remark,
          stStartTime: item.stStartTime,
          stEndTime: item.stEndTime,
        };
      });
      setListST(rows);
    }
  }, [responveST]);
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
    },
    {
      field: 'branch',
      headerName: 'สาขา',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
    },
    {
      field: 'createdAt',
      headerName: 'วันที่สร้าง รายการ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
    },
    {
      field: 'stStartTime',
      headerName: 'วัน/เวลา ที่เริ่ม',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
      renderCell: (params) => {
        const start = params.value?.toString();
        return (
          <Typography variant="body2" noWrap>
            {moment(start).format('HH:mm a')}
          </Typography>
        );
      },
    },
    {
      field: 'stEndTime',
      headerName: 'วัน/เวลา ที่สิ้นสุด',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
      renderCell: (params) => {
        const end = params.value?.toString();
        return (
          <Typography variant="body2" noWrap>
            {moment(end).format('HH:mm a')}
          </Typography>
        );
      },
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
    },
  ];
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
      case BDStatus.DRAFT:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#FBA600', backgroundColor: '#FFF0CA' });
        break;
      case BDStatus.WAIT_FOR_APPROVAL:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#FBA600', backgroundColor: '#FFF0CA' });
        break;
      case BDStatus.APPROVED:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#20AE79', backgroundColor: '#E7FFE9' });
        break;
      case BDStatus.BARCODE_PRINTED:
        statusDisplay = genRowStatusValue(statusLabel, { color: '#4465CD', backgroundColor: '#C8E8FF' });
        break;
      case BDStatus.REJECT:
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
    setOpenCreateModal(false);
  };
  const handleClickCell = () => {
    setOpenCreateModal(true);
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
      {openCreateModal && (
        <STCreateModal
          type={'View'}
          setOpenPopup={setOpenPopup}
          setPopupMsg={setPopupMsg}
          isOpen={openCreateModal}
          onClickClose={handleCloseCreateModal}
        />
      )}
    </>
  );
};
export default SaleLimitTimeList;
