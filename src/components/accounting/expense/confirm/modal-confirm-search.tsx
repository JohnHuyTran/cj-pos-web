import React, { ReactElement, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingModal from '../../../commons/ui/loading-modal';
import { useStyles } from '../../../../styles/makeTheme';
import ConfirmContent from './confirm-content';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ExpenseInfo } from '../../../../models/branch-accounting-model';
import { useAppSelector } from '../../../../store/store';
import { isFilterFieldInExpense } from '../../../../utils/utils';
import { Box, TextField } from '@mui/material';
import NumberFormat from 'react-number-format';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (period: any) => void;
  items?: any;
  summarizTitle: string;
  summarizList: any;
}
interface loadingModalState {
  open: boolean;
}

export default function ModelConfirmSearch({
  open,
  onClose,
  onConfirm,
  items,
  summarizTitle,
  summarizList,
}: Props): ReactElement {
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
  const [periodData, setPeriodData] = React.useState('');

  const handleConfirm = async () => {
    handleOpenLoading('open', true);
    await onConfirm(periodData);
    handleOpenLoading('open', false);
    onClose();
  };

  const handleDate = async (period: any) => {
    setPeriodData(period);
  };

  const expenseMasterList = useAppSelector((state) => state.masterExpenseListSlice.masterExpenseList.data);
  const getMasterExpenInto = (key: any) => expenseMasterList.find((e: ExpenseInfo) => e.expenseNo === key);
  const [columnsList, setColumnsList] = React.useState<GridColDef[]>([]);
  const [rowList, setRowList] = React.useState<any[]>([]);
  useEffect(() => {
    if (items.length > 0) {
      setStartDate(items[0].expensePeriod.startDate);
      setEndDate(items[0].expensePeriod.endDate);
    }

    if (summarizList) {
      let infosWithDraw: any;
      summarizList.sumItems.map((item: any) => {
        infosWithDraw = {
          ...infosWithDraw,
          [item.expenseNo]: item.approvedAmount,
        };
      });

      infosWithDraw = {
        ...infosWithDraw,
        id: 1,
      };

      setRowList([infosWithDraw]);

      const columns: GridColDef[] = summarizList.sumItems.map((i: ExpenseInfo) => {
        const master = getMasterExpenInto(i.expenseNo);
        const hideColumn = master ? master.isOtherExpense : false;
        let accountNameTh = master?.accountNameTh;
        if (i.expenseNo === 'SUMOTHER') accountNameTh = 'รวม';

        return {
          field: i.expenseNo,
          headerName: accountNameTh,
          minWidth: 120,
          flex: 0.6,
          headerAlign: 'center',
          align: 'right',
          sortable: false,
          hide: hideColumn,
          renderCell: (params: GridRenderCellParams) => {
            if (isFilterFieldInExpense(params.field)) {
              return (
                // <Box component='div' sx={{ paddingRight: '5px' }}>
                //   {params.value}
                // </Box>

                <NumberFormat
                  value={String(params.value)}
                  thousandSeparator={true}
                  decimalScale={2}
                  className={classes.MtextFieldNumber}
                  disabled={true}
                  customInput={TextField}
                  fixedDecimalScale
                />
              );
            }
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
            startDate={startDate}
            endDate={endDate}
            handleDate={handleDate}
            title={summarizTitle}
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
