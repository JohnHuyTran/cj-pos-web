import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import { Grid } from '@mui/material';
import React from 'react';
import SnackbarStatus from '../commons/ui/snackbar-status';
import { useAppDispatch, useAppSelector } from '../../store/store';
import LoadingModal from '../commons/ui/loading-modal';
import { getsaleLimitTimeDetail } from '../../store/slices/sale-limit-time-detail-slice';
import STCreateModal from '../sale-limit-time/sale-limit-time-create-modal';

type TaskType = {
  permission: string;
  payload: any;
  onSearch: () => void;
};

export default function TaskForSaleLimitTime(props: TaskType) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const saleLimitTimeDetail = useAppSelector((state) => state.saleLimitTimeDetailSlice.saleLimitTimeDetail);

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const currentlySelected = async () => {
    setOpenLoadingModal(true);
    try {
      await dispatch(getsaleLimitTimeDetail(props.payload._id));
      if (saleLimitTimeDetail.data.length > 0 || saleLimitTimeDetail.data) {
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
          marginBottom: '5px',
          boxShadow: '-5px -5px 8px rgba(0, 0, 0, 0.03), 5px 5px 10px rgba(0, 0, 0, 0.03)',
          cursor: 'pointer',
          border: '1px solid #EAEBEB',
          borderRadius: '8px',
          paddingRight: '20px',
          height: 'auto',
        }}
        onClick={currentlySelected}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={11} sx={{ display: 'flex' }}>
              <span style={{ fontSize: '16px' }}>[แจ้งเตือน]</span>
              <span style={{ marginLeft: 15, marginRight: 5, color: theme.palette.primary.main }}>
                กำหนด (งด) ขายสินค้า
              </span>
              {'|'}
              <span style={{ marginLeft: 5 }}>{props.payload.documentNumber}</span>{' '}
              <Typography ml={1}>{props.payload.description}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography
                sx={{
                  backgroundColor: '#E7FFE9',
                  color: '#36C690',
                  textAlign: 'center',
                  paddingTop: '4px',
                  paddingBottom: '5px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                เริ่มใช้งาน
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} paddingTop="7px">
            <Grid item xs={9}>
              <span style={{ marginLeft: '5rem' }}>
                เริ่มต้น - สิ้นสุด : {moment(props.payload.stStartTime).add(543, 'y').format('DD/MM/YYYY HH.mm')} น.
                {' - '}
                {moment(props.payload.stEndTime).add(543, 'y').format('DD/MM/YYYY HH.mm')} น.
              </span>
            </Grid>
            <Grid item xs={3} sx={{ color: theme.palette.grey[500], textAlign: 'right' }}>
              วันที่ทำรายการ {moment(props.payload.createdAt).add(543, 'y').format('DD/MM/YYYY HH.mm')}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {openDetail && (
        <STCreateModal
          type={'Detail'}
          isAdmin={false}
          setOpenPopup={setOpenPopup}
          setPopupMsg={setPopupMsg}
          isOpen={openDetail}
          onClickClose={handleCloseDetail}
          onSearch={props.onSearch}
        />
      )}

      <SnackbarStatus open={openPopup} onClose={handleClosePopup} isSuccess={true} contentMsg={popupMsg} />
      <LoadingModal open={openLoadingModal} />
    </>
  );
}
