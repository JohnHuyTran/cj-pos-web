import React, { ReactElement } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import { SupplierItem } from '../../mockdata/supplier-items';
import { useAppDispatch } from '../../store/store';
import { updateItemsState } from '../../store/slices/supplier-add-items-slice';
import LoadingModal from '../commons/ui/loading-modal';
import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { DeleteForever } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ModelAddItems({ open, onClose }: Props): ReactElement {
  const dispatch = useAppDispatch();
  const [openLoadingModal, setOpenLoadingModal] = React.useState(false);

  const handleAddItem = async () => {
    setOpenLoadingModal(true);
    const payload = SupplierItem;
    await dispatch(updateItemsState(payload));

    setTimeout(() => {
      setOpenLoadingModal(false);
      onClose();
    }, 300);
  };
  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      sx={{ minWidth: 500 }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ color: '#263238' }}>
          <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
            เพิ่มสินค้า (Mockup Data)
          </Typography>

          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {SupplierItem.items.map((value) => (
              <ListItem
                key={value.seqItem}
                disableGutters
                secondaryAction={
                  <IconButton>
                    <DeleteForever fontSize="medium" sx={{ color: '#F54949' }} />
                  </IconButton>
                }
              >
                {/* <ListItemText primary={value.productName} /> */}
                {value.productName} | {value.skuCode} | {value.barcode}
              </ListItem>
            ))}
          </List>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'end', mb: 2 }}>
        <Button id="btnConfirm" variant="contained" sx={{ borderRadius: 2, width: 100 }} onClick={handleAddItem}>
          เพิ่มสินค้า
        </Button>
      </DialogActions>

      <LoadingModal open={openLoadingModal} />
    </Dialog>
  );
}
