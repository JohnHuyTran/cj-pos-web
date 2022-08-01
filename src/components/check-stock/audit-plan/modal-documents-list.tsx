import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import theme from '../../../styles/theme';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import ModalCreateStockCount from '../stock-count/modal-create-stock-count';
import { Action } from '../../../utils/enum/common-enum';

import { getStockCountDetail } from '../../../store/slices/stock-count-detail-slice';
import LoadingModal from '../../commons/ui/loading-modal';
import { getUserInfo } from '../../../store/sessionStore';

interface Props {
  viewMode?: boolean;
}

const DocumentList = ({viewMode}:Props) => {
  const dispatch = useAppDispatch();
  const [openListDocNo, setOpenListDocNo] = useState<boolean>(false);
  const dataDetail = useAppSelector((state) => state.auditPlanDetailSlice.auditPlanDetail.data);
  const relatedDocuments = dataDetail.relatedDocuments;
  const [popupMsg, setPopupMsg] = React.useState<string>('');
  const [openDetail, setOpenDetail] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState<boolean>(false);
  const stockCountDetail = useAppSelector((state) => state.stockCountDetailSlice.stockCountDetail);
  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const [openLoadingModal, setOpenLoadingModal] = React.useState<boolean>(false);
  const currentlySelected = async (item: any) => {
    if (viewMode) return;
    setOpenLoadingModal(true);
    try {
      await dispatch(getStockCountDetail(item.id));
      if (stockCountDetail.data.length > 0 || stockCountDetail.data) {
        setOpenDetail(true);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenLoadingModal(false);
  };

  return (
    <>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderRadius: '5px',
          border: `1px dashed ${theme.palette.primary.main}`,
        }}>
        <Box>
          <Box
            onClick={() => {
              setOpenListDocNo(!openListDocNo);
            }}
            // fontSize={'14px'}
            display={'flex'}
            justifyContent={'space-between'}>
            คลิกเพื่อดูเอกสารอ้างอิง
            {openListDocNo ? <ExpandLess color="success" /> : <ExpandMore color="success" />}
          </Box>
          {openListDocNo &&
            relatedDocuments &&
            relatedDocuments.length > 0 &&
            relatedDocuments.map((item, index) => (
              <Box
                key={`item-${index + 1}-${item}`}
                component="a"
                href={void 0}
                sx={{
                  color: theme.palette.secondary.main,
                }}
                onClick={() => currentlySelected(item)}>
                <Typography
                  color="secondary"
                  sx={{ textDecoration: 'underline', fontSize: '14px', whiteSpace: 'normal', cursor: 'pointer' }}
                  noWrap>
                  {item.documentNumber} ครั้งที่ {item.countingTime}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>
      {openDetail && (
        <ModalCreateStockCount
          isOpen={openDetail}
          onClickClose={handleCloseDetail}
          action={Action.UPDATE}
          setPopupMsg={setPopupMsg}
          setOpenPopup={setOpenPopup}
          viewMode={true}
          userPermission={getUserInfo().acl['service.posback-stock'] != null && getUserInfo().acl['service.posback-stock'].length > 0
          ? getUserInfo().acl['service.posback-stock']
          : []}
        />
      )}
      <LoadingModal open={openLoadingModal} />
    </>
  );
};

export default DocumentList;
