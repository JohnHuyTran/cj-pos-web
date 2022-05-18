import React from 'react';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button, Grid } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import ModalPurchaseBranchDetail from './purchase-branch-detail';
import { useAppDispatch } from '../../../store/store';
import { updateAddItemsState } from '../../../store/slices/add-items-slice';
import LoadingModal from '../../commons/ui/loading-modal';

interface loadingModalState {
  open: boolean;
}

function CreatePurchaseBranch() {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const [openLoadingModal, setOpenLoadingModal] = React.useState<loadingModalState>({
    open: false,
  });
  const handleOpenLoading = (prop: any, event: boolean) => {
    setOpenLoadingModal({ ...openLoadingModal, [prop]: event });
  };

  const [openDetailModal, setOpenDetailModal] = React.useState(false);
  const handleOpenDetailModal = async () => {
    handleOpenLoading('open', true);
    await dispatch(updateAddItemsState({}));
    setOpenDetailModal(true);
    handleOpenLoading('open', false);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
  };

  return (
    <>
      <Box mb={6}>
        <Grid item xs={7}>
          <Button
            id='btnCreateStockTransferModal'
            variant='contained'
            onClick={handleOpenDetailModal}
            // sx={{ width: 150, display: `${displayBtnCreate ? 'none' : ''}` }}
            className={classes.MbtnClear}
            startIcon={<AddCircleOutlineOutlined />}
            color='secondary'>
            สร้างเอกสารใหม่
          </Button>
        </Grid>
      </Box>
      {openDetailModal && <ModalPurchaseBranchDetail isOpen={openDetailModal} onClickClose={handleCloseDetailModal} />}

      <LoadingModal open={openLoadingModal.open} />
    </>
  );
}

export default CreatePurchaseBranch;
