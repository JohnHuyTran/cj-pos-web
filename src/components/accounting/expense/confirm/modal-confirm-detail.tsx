import React, { ReactElement, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingModal from '../../../commons/ui/loading-modal';
import { useStyles } from '../../../../styles/makeTheme';
import ConfirmContent from './confirm-content';
import { ExpenseInfo, ExpensePeriod } from '../../../../models/branch-accounting-model';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { isFilterFieldInExpense } from '../../../../utils/utils';
import { Box, TextField } from '@mui/material';
import NumberFormat from 'react-number-format';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: any) => void;
  payload?: any;
  periodProps?: ExpensePeriod;
}
interface loadingModalState {
  open: boolean;
}

export default function ModelConfirm({ open, onClose, onConfirm, payload, periodProps }: Props): ReactElement {
  const classes = useStyles();
  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const date = new Date();
  const [startDate, setStartDate] = React.useState(String(date));
  const [endDate, setEndDate] = React.useState(String(date));
  const [periodData, setPeriodData] = React.useState({
    startDate: startDate,
    endDate: endDate,
  });

  const handleConfirm = async () => {
    // console.log('periodData:', periodData);
    handleOpenLoading('open', true);
    onConfirm({ period: periodData });
    handleOpenLoading('open', false);
    onClose();
  };

  const handleDate = async (period: any) => {
    // console.log('period:', period);
    setPeriodData(period);
  };

  const [columnsList, setColumnsList] = React.useState<GridColDef[]>([]);
  const [rowList, setRowList] = React.useState<any[]>([]);
  useEffect(() => {
    if (periodProps) {
      setStartDate(periodProps?.startDate);
      setEndDate(periodProps?.endDate);

      // setPeriodData({
      //   startDate: periodProps?.startDate,
      //   endDate: periodProps?.endDate,
      // });
    }

    if (payload) {
      let _newExpenseAllList: any[] = [];
      let sumValue = 0;
      payload.map((i: any) => {
        sumValue += Number(i.value);
        _newExpenseAllList.push(i);
      });
      const approvedAmountList = {
        key: 'approvedAmount',
        title: 'รวม',
        value: sumValue,
      };
      _newExpenseAllList.push(approvedAmountList);

      let infosWithDraw: any;
      _newExpenseAllList.map((item: any) => {
        infosWithDraw = {
          ...infosWithDraw,
          [item.key]: item.value,
        };
      });

      infosWithDraw = {
        ...infosWithDraw,
        id: 1,
      };
      setRowList([infosWithDraw]);

      const columns: GridColDef[] = _newExpenseAllList.map((i: any) => {
        let hideColumn = i.isOtherExpense;
        if (hideColumn !== false) {
          hideColumn = true;
        }

        if (i.key === 'approvedAmount') {
          return {
            field: i.key,
            headerName: i.title,
            minWidth: 120,
            flex: 0.6,
            headerAlign: 'center',
            align: 'right',
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
              return (
                <NumberFormat
                  value={String(params.value)}
                  thousandSeparator={true}
                  decimalScale={2}
                  className={classes.MtextFieldNumber}
                  disabled={true}
                  customInput={TextField}
                  sx={{
                    '.MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#36C690',
                      fontWeight: '600',
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '.MuiInputBase-input-MuiOutlinedInput-input': {
                      textAlign: 'right',
                    },
                  }}
                  fixedDecimalScale
                  type='text'
                />
              );
            },
          };
        }

        return {
          field: i.key,
          headerName: i.title,
          minWidth: 120,
          flex: 0.6,
          headerAlign: 'center',
          align: 'right',
          sortable: false,
          hide: hideColumn,
          renderCell: (params: GridRenderCellParams) => {
            return (
              <NumberFormat
                value={String(params.value)}
                thousandSeparator={true}
                decimalScale={2}
                className={classes.MtextFieldNumber}
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
                type='text'
              />
            );
          },
        };
      });

      setColumnsList(columns);
    }
  }, [open === true]);

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='lg'
        PaperProps={{ sx: { minWidth: 900 } }}>
        <DialogContent sx={{ mt: 3, mr: 3, ml: 3 }}>
          <ConfirmContent
            startPeriod={startDate}
            endPeriod={endDate}
            handleDate={handleDate}
            title='1 สาขา'
            columnsList={columnsList}
            rowList={rowList}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', m: 5, mr: 5, ml: 5 }}>
          <Button
            id='btnCancle'
            variant='contained'
            color='cancelColor'
            sx={{ borderRadius: 2, width: 120, mr: 4 }}
            onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            id='btnConfirm'
            variant='contained'
            color='primary'
            sx={{ borderRadius: 2, width: 120 }}
            onClick={handleConfirm}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingModal open={openLoadingModal.open} />
    </div>
  );
}
