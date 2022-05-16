import React from 'react';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { Box, Button, Grid } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import ModalPurchaseBranchDetail from './purchase-branch-detail';

function CreatePurchaseBranch() {
  const classes = useStyles();

  const [openDetailModal, setOpenDetailModal] = React.useState(false);
  const handleOpenDetailModal = async () => {
    setOpenDetailModal(true);
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
    </>
  );
}

export default CreatePurchaseBranch;
