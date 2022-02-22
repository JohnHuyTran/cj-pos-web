import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React from 'react';
import { useStyles } from '../../styles/makeTheme';
import { genColumnValue, numberWithCommas, objectNullOrEmpty, stringNullOrEmpty } from '../../utils/utils';
import { Action, BDStatus, DateFormat } from '../../utils/enum/common-enum';
import HtmlTooltip from '../../components/commons/ui/html-tooltip';
import { useTranslation } from 'react-i18next';

interface StateProps {
  onSearch: () => void;
}
const SaleLimitTimeList: React.FC<StateProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation(['barcodeDiscount']);
  const [rows, setRows] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(10);
  const [loading, setLoading] = React.useState<boolean>(false);

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

  const genRowStatusValue = (statusLabel: string, styleCustom: any) => {
    return (
      <HtmlTooltip title={<React.Fragment>{statusLabel}</React.Fragment>}>
        <Typography className={classes.MLabelBDStatus} sx={styleCustom}>
          {statusLabel}
        </Typography>
      </HtmlTooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: 'ลำดับ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
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
      field: 'startDate',
      headerName: 'วัน/เวลา ที่เริ่ม',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
    },
    {
      field: 'endDate',
      headerName: 'วัน/เวลา ที่สิ้นสุด',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
    },
    {
      field: 'remark',
      headerName: 'หมายเหตุ',
      headerAlign: 'center',
      sortable: false,
      minWidth: 170,
    },
  ];
  const handlePageChange = () => {};
  const handlePageSizeChange = () => {};
  return (
    <div className={classes.MdataGridDetail}>
      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          hideFooterSelectedRowCount={true}
          autoHeight={rows.length < 10}
          scrollbarSize={10}
          pagination
          page={currentPage - 1}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50, 100]}
          paginationMode="server"
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
          rowHeight={45}
          components={{
            NoRowsOverlay: () => (
              <Typography position="relative" textAlign="center" top="112px" color="#AEAEAE">
                ไม่มีข้อมูล
              </Typography>
            ),
          }}
        />
      </Box>
    </div>
  );
};
export default SaleLimitTimeList;
