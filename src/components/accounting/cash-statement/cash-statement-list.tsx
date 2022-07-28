import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowData,
  useGridApiRef,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useStyles } from '../../../styles/makeTheme';
import LoadingModal from '../../commons/ui/loading-modal';
import { Chip, TextField } from '@mui/material';
import { getUserInfo } from '../../../store/sessionStore';
import { PERMISSION_GROUP } from '../../../utils/enum/permission-enum';
import { DeleteForever, Edit } from '@mui/icons-material';
import NumberFormat from 'react-number-format';

import ModalEditSearchList from './modal-edit-search-list';

interface loadingModalState {
  open: boolean;
}

export interface DataGridProps {
  onSelectRows: (rowsList: Array<any>) => void;
}

const columns: GridColDef[] = [
  {
    field: 'index',
    headerName: 'ลำดับ',
    width: 80,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params) => (
      <Box component="div" sx={{ paddingLeft: '20px' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'branch',
    headerName: 'สาขา',
    minWidth: 120,
    flex: 1.2,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'date1',
    headerName: 'วันที่เงินขาด-เกิน',
    minWidth: 150,
    headerAlign: 'center',
    align: 'left',
    sortable: false,
  },
  {
    field: 'date2',
    headerName: 'วันที่ยอดขาย',
    minWidth: 120,
    flex: 1.2,
    headerAlign: 'center',
    sortable: false,
  },
  {
    field: 'cash1',
    headerName: 'เงินขาด',
    minWidth: 120,
    flex: 1.2,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NumberFormat
          value={String(params.value)}
          thousandSeparator={true}
          decimalScale={2}
          disabled={true}
          customInput={TextField}
          sx={{
            '.MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '.MuiInputBase-input-MuiOutlinedInput-input': {
              textAlign: 'right',
            },
          }}
          fixedDecimalScale
          type="text"
        />
      );
    },
  },
  {
    field: 'cash2',
    headerName: 'เงินเกิน',
    minWidth: 120,
    headerAlign: 'center',
    align: 'left',
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NumberFormat
          value={String(params.value)}
          thousandSeparator={true}
          decimalScale={2}
          // className={classes.MtextFieldNumber}
          disabled={true}
          customInput={TextField}
          sx={{
            '.MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000',
            },
            '.MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '.MuiInputBase-input-MuiOutlinedInput-input': {
              textAlign: 'right',
            },
          }}
          fixedDecimalScale
          type="text"
        />
      );
    },
  },
  {
    field: 'status',
    headerName: 'สถานะ',
    minWidth: 80,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: (params) => {
      if (params.value === 'DRAFT') {
        return (
          <Chip
            label={params.getValue(params.id, 'statusText')}
            size="small"
            sx={{ color: '#FBA600', backgroundColor: '#FFF0CA' }}
          />
        );
      } else if (params.value === 'APPROVED') {
        return (
          <Chip
            label={params.getValue(params.id, 'statusText')}
            size="small"
            sx={{ color: '#20AE79', backgroundColor: '#E7FFE9' }}
          />
        );
      }
    },
  },
  {
    field: 'edit',
    headerName: ' ',
    width: 50,
    align: 'center',
    sortable: false,
    renderCell: (params) => {
      return (
        <div>
          <Edit fontSize="medium" sx={{ color: '#AEAEAE' }} />
        </div>
      );
    },
  },
  {
    field: 'delete',
    headerName: ' ',
    width: 50,
    align: 'center',
    sortable: false,
    renderCell: (params) => {
      return (
        <div>
          <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />
        </div>
      );
    },
  },
];

function useApiRef() {
  const apiRef = useGridApiRef();
  const _columns = useMemo(
    () =>
      columns.concat({
        field: '',
        width: 0,
        minWidth: 0,
        sortable: false,
        renderCell: (params) => {
          apiRef.current = params.api;
          return null;
        },
      }),
    [columns]
  );

  return { apiRef, columns: _columns };
}

function CashStatementList({ onSelectRows }: DataGridProps) {
  const { t } = useTranslation(['cashStatement', 'common']);
  const classes = useStyles();

  useEffect(() => {}, []);

  const { apiRef, columns } = useApiRef();
  const rows = [
    {
      id: 1,
      index: 1,
      branch: 'xxx',
      date1: '26/07/2565',
      date2: '26/07/2565',
      cash1: 5555,
      cash2: 0,
      status: 'DRAFT',
      statusText: t(`status.DRAFT`),
      delete: '',
    },
    {
      id: 2,
      index: 2,
      branch: 'xxx',
      date1: '26/07/2565',
      date2: '26/07/2565',
      cash1: 5555,
      cash2: 0,
      status: 'APPROVED',
      statusText: t(`status.APPROVED`),
      delete: '',
    },
  ];

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });

  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const handleSubmitRowSelect = async () => {
    const rowSelect = apiRef.current.getSelectedRows();
    let rowSelectList: any = [];
    rowSelect.forEach((data: GridRowData) => {
      // rowSelectList.push(data.rtNo);
      rowSelectList.push(data);
    });

    return onSelectRows(rowSelectList ? rowSelectList : []);
  };

  const [openModalEdit, setOpenModalEdit] = React.useState(false);
  const [payloadCash, setPayloadCash] = React.useState({
    cashOver: 0,
    cashShort: 0,
  });
  const [selectRowsDeleteList, setSelectRowsDeleteList] = React.useState<Array<any>>([]);
  const currentlySelected = async (params: GridCellParams) => {
    const value = params.colDef.field;
    if (value === 'delete') {
      handleDelete(params.row);
    } else if (value === 'edit') {
      handleEdit(params.row);
    }
  };

  const handleEdit = async (data: any) => {
    setOpenModalEdit(true);
    setPayloadCash(data);
  };

  const onCloseModalEdit = () => {
    setOpenModalEdit(false);
  };

  const handleDelete = async (data: any) => {
    console.log('handleDelete:', JSON.stringify(data));
    setSelectRowsDeleteList(data);
  };

  return (
    <div>
      <Box mt={2} bgcolor="background.paper">
        <Box className={classes.MdataGridPaginationTop} sx={{ height: '25vh' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            pageSize={5}
            rowsPerPageOptions={[10, 20, 50, 100]}
            autoHeight={rows.length >= 10 ? false : true}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={handleSubmitRowSelect}
            onCellClick={currentlySelected}
          />
        </Box>
      </Box>

      <ModalEditSearchList open={openModalEdit} onClose={onCloseModalEdit} payloadCash={payloadCash} />

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}

export default CashStatementList;
