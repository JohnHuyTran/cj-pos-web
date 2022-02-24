import { Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material';
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
  const [checkAll, setCheckAll] = React.useState<boolean>(false);
  const rows = [
    {
      id: '1',
      index: `1`,
      documentNumber: 'documentNumber',
      status: '1',
      description: '1',
      branch: 'branch',
      createdAt: 'createdAt',
      startDate: 'startDate',
      endDate: 'endDate',
      remark: '213',
    },
  ];
  const columns: GridColDef[] = [
    {
      field: 'checked',
      headerName: t('numberOrder'),
      width: 100,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderHeader: (params) => (
        <FormControl component="fieldset" sx={{ marginLeft: '-15px' }}>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              className={classes.MFormControlLabel}
              value="top"
              control={<Checkbox checked={checkAll} />}
              label={t('selectAll')}
              labelPlacement="top"
            />
          </FormGroup>
        </FormControl>
      ),
      renderCell: (params) => (
        <Checkbox checked={Boolean(params.value)} disabled={BDStatus.APPROVED != params.row.status} />
      ),
    },
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
      // renderCell: (params) => genRowStatus(params),
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
    <>
      <div className={classes.MdataGridPaginationTop} style={{ height: '60vh', width: '100%' }}>
        <DataGrid columns={columns} rows={rows} />
      </div>
    </>
  );
};
export default SaleLimitTimeList;
