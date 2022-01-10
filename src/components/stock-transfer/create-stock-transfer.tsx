import React, { ReactElement, useEffect } from 'react';
import moment from 'moment';
import { useAppSelector } from '../../store/store';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Button, DialogTitle, Grid, IconButton, InputBase, TextField } from '@mui/material';
import { ControlPoint, HighlightOff, UploadFile } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Steppers from './steppers';
import { useStyles } from '../../styles/makeTheme';
import DatePickerComponent from '../commons/ui/date-picker';
import BranchListDropDown from '../commons/ui/branch-list-dropdown';
import StockTransferItem from './stock-transfer-item';
import { useAppDispatch } from '../../store/store';
import { featchAllItemsListAsync } from '../../store/slices/search-all-items';
import ModalAddItems from '../commons/ui/modal-add-items';

interface State {
  branchCode: string;
}

interface Props {
  isOpen: boolean;
  onClickClose: () => void;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme: any) => theme.palette.grey[400],
          }}
        >
          <HighlightOff fontSize="large" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

function createStockTransfer({ isOpen, onClickClose }: Props): ReactElement {
  const [open, setOpen] = React.useState(isOpen);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const payloadAddItem = useAppSelector((state) => state.addItems.state);
  let rowLength = Object.keys(payloadAddItem).length;

  const [status, setStatus] = React.useState(0);
  const [btNo, setBtNo] = React.useState('-');
  const [createDate, setCreateDate] = React.useState<Date | null>(new Date());
  const [values, setValues] = React.useState<State>({
    branchCode: '',
  });

  const handleClose = async () => {
    setOpen(false);
    onClickClose();
  };

  useEffect(() => {
    setOpen(isOpen);

    dispatch(featchAllItemsListAsync());
  }, [open]);

  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const handleStartDatePicker = (value: any) => {
    setStartDate(value);
  };

  const handleEndDatePicker = (value: Date) => {
    setEndDate(value);
  };

  const [startBranch, setStartBranch] = React.useState('');
  const [endBranch, setEndBranch] = React.useState('');
  const [clearBranchDropDown, setClearBranchDropDown] = React.useState<boolean>(false);
  const handleChangeStartBranch = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
      setStartBranch(codes);
    } else {
      setValues({ ...values, branchCode: '' });
    }
  };
  const handleChangeEndBranch = (branchCode: string) => {
    if (branchCode !== null) {
      let codes = JSON.stringify(branchCode);
      setValues({ ...values, branchCode: JSON.parse(codes) });
      setEndBranch(codes);
    } else {
      setValues({ ...values, branchCode: '' });
    }
  };

  const [openModelAddItems, setOpenModelAddItems] = React.useState(false);
  const handleOpenAddItems = () => {
    setOpenModelAddItems(true);
  };
  const handleModelAddItems = async () => {
    setOpenModelAddItems(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth="xl" fullWidth={true}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          <Typography sx={{ fontSize: 24, fontWeight: 400 }}>สร้างรายการโอนสินค้า</Typography>
          <Steppers status={status}></Steppers>
        </BootstrapDialogTitle>

        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              เลขที่เอกสาร BT :
            </Grid>
            <Grid item xs={4}>
              {btNo}
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={2}>
              วันที่สร้างรายการ :
            </Grid>
            <Grid item xs={4}>
              {moment(createDate).format('DD/MM/YYYY')}
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              วันที่โอนสินค้า :
            </Grid>
            <Grid item xs={3}>
              <DatePickerComponent onClickDate={handleStartDatePicker} value={startDate} />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              วันที่สิ้นสุด :
            </Grid>
            <Grid item xs={3}>
              <DatePickerComponent
                onClickDate={handleEndDatePicker}
                value={endDate}
                type={'TO'}
                minDateTo={startDate}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={2}>
              สาขาต้นทาง* :
            </Grid>
            <Grid item xs={3}>
              <BranchListDropDown
                sourceBranchCode={endBranch}
                onChangeBranch={handleChangeStartBranch}
                isClear={clearBranchDropDown}
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              สาขาปลายทาง* :
            </Grid>
            <Grid item xs={3}>
              <BranchListDropDown
                sourceBranchCode={startBranch}
                onChangeBranch={handleChangeEndBranch}
                isClear={clearBranchDropDown}
              />
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>

          <Grid container spacing={2} mt={4} mb={2}>
            <Grid item xs={5}>
              <Button
                id="btnAddItem"
                variant="contained"
                color="info"
                className={classes.MbtnPrint}
                onClick={handleOpenAddItems}
                startIcon={<ControlPoint />}
                sx={{ width: 200 }}
              >
                เพิ่มสินค้า
              </Button>
            </Grid>
            <Grid item xs={7} sx={{ textAlign: 'end' }}>
              <Button
                id="btnSave"
                variant="contained"
                color="warning"
                className={classes.MbtnSave}
                // onClick={handleSaveButton}
                startIcon={<SaveIcon />}
                sx={{ width: 140 }}
                disabled={rowLength == 0}
              >
                บันทึก
              </Button>

              <Button
                id="btnCreateTransfer"
                variant="contained"
                color="secondary"
                className={classes.MbtnSave}
                // onClick={handleSaveButton}
                startIcon={<AddCircleOutlineOutlinedIcon />}
                sx={{ width: 140 }}
                disabled={rowLength == 0}
              >
                สร้างใบโอน
              </Button>

              <Button
                id="btnUploadBatch"
                variant="contained"
                color="primary"
                className={classes.MbtnSave}
                // onClick={handleSaveButton}
                startIcon={<UploadFile />}
                sx={{ width: 200 }}
                // disabled={rows.length == 0}
              >
                Upload งาน Batch
              </Button>
            </Grid>
          </Grid>

          <StockTransferItem id="" />
        </DialogContent>
      </Dialog>

      <ModalAddItems open={openModelAddItems} onClose={handleModelAddItems}></ModalAddItems>
    </div>
  );
}

export default createStockTransfer;
