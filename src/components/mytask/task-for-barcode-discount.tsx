import Typography from '@mui/material/Typography';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { Grid, ListItemIcon } from '@mui/material';
import { ShoppingCartSharp } from '@mui/icons-material';
import React from 'react';
import ModalCreateBarcodeDiscount from '../barcode-discount/modal-create-barcode-discount';
import { Action } from '../../utils/enum/common-enum';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getBarcodeDiscountDetail } from '../../store/slices/barcode-discount-detail-slice';
import LoadingModal from '../commons/ui/loading-modal';

type TaskType = {
  permission: string;
  userPermission: any[];
  payload: any;
  onSearch: () => void;
};

export default function TaskForApprover(props: TaskType) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const barcodeDiscountDetail = useAppSelector((state) => state.barcodeDiscountDetailSlice.barcodeDiscountDetail);
  const status = props.payload.status;

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const currentlySelected = async () => {
    setOpenLoadingModal(true);
    try {
      await dispatch(getBarcodeDiscountDetail(props.payload._id));
      if (barcodeDiscountDetail.data.length > 0 || barcodeDiscountDetail.data) {
        setOpenDetail(true);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenLoadingModal(false);
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: '-5px -5px 8px rgba(0, 0, 0, 0.03), 5px 5px 10px rgba(0, 0, 0, 0.03)',
          cursor: 'pointer',
          border: '1px solid #EAEBEB',
          borderRadius: '8px',
          height: 'auto',
          paddingRight: '20px',
          mb: 2,
        }}
        onClick={currentlySelected}
      >
        <CardContent>
          <Grid container spacing={2} mb={1}>
            <Grid item xs={11} sx={{ display: 'flex', marginTop: '8px' }}>
              <span style={{ fontSize: '16px' }}>[งานของฉัน]</span>
              <span style={{ marginLeft: 15, marginRight: 5, color: theme.palette.primary.main }}>ส่วนลดสินค้า</span>
              {'|'}
              <span style={{ marginLeft: 5 }}>{props.payload.documentNumber}</span>{' '}
              <span style={{ marginLeft: '15px', color: theme.palette.primary.main }}>กำหนดดำเนินการ วันนี้</span>
            </Grid>
            <Grid item xs={1} sx={{}}>
              <Typography
                sx={{
                  backgroundColor: status === 3 ? '#FFE9B1' : status === 4 ? '#E7FFE9' : status === 5 ? '#FFD7D7' : '',
                  color:
                    status === 3 ? 'rgba(251, 166, 0, 1)' : status === 4 ? '#36C690' : status === 5 ? '#F54949' : '',
                  textAlign: 'center',
                  paddingTop: '4px',
                  paddingBottom: '5px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {status === 3 ? 'รออนุมัติ' : status === 4 ? 'อนุมัติ' : status === 5 ? 'ไม่อนุมัติ' : null}
              </Typography>
            </Grid>
          </Grid>
          <Typography style={{ color: theme.palette.grey[500], textAlign: 'right' }}>
            วันที่ทำรายการ {moment(props.payload.transactionDate).add(543, 'y').format('DD/MM/YYYY')}{' '}
            {moment(props.payload.transactionDate).format('HH.mm')} น.
          </Typography>
        </CardContent>
      </Card>

      {openDetail && (
        <ModalCreateBarcodeDiscount
          isOpen={openDetail}
          onClickClose={handleCloseDetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          userPermission={props.userPermission}
          onSearchBD={props.onSearch}
        />
      )}
      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
      <LoadingModal open={openLoadingModal} />
    </>
  );
}
