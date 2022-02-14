import { Button } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useStyles } from '../../styles/makeTheme';
import React from 'react';
import STCreateModal from '../../components/sale-limit-time/sale-limit-time-create-modal';

const SaleLimitTimeSearch = () => {
  const classes = useStyles();
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };
  return (
    <>
      <Button
        id="btnCreate"
        variant="contained"
        sx={{ width: '220px' }}
        className={classes.MbtnSearch}
        color="secondary"
        startIcon={<AddCircleOutlineOutlinedIcon />}
        onClick={handleOpenCreateModal}
      >
        {'สร้างเอกสารใหม่'}
      </Button>
      {openCreateModal && (
        <STCreateModal type={'Create'} isOpen={openCreateModal} onClickClose={handleCloseCreateModal} />
      )}
    </>
  );
};

export default SaleLimitTimeSearch;
