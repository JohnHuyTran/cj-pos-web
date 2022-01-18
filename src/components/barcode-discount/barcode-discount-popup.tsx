import { ReactElement } from 'react';
import Snackbar from '@mui/material/Snackbar';
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Typography } from '@mui/material';
import HighlightOff from '@mui/icons-material/HighlightOff';
import { Box } from '@mui/system';

interface Props {
  open: boolean;
  onClose: () => void;
  contentMsg: string;
}

export default function BarcodeDiscountPopup({
  open,
  onClose,
  contentMsg,
}: Props): ReactElement {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box
        width="433px"
        height="83px"
        display="flex"
        bgcolor="#36C690"
        borderRadius="10px"
        padding="17px 0 0 17px"
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            color: (theme: any) => theme.palette.common.white,
          }}
        >
          <HighlightOff fontSize="large" />
        </IconButton>
        <InfoIcon style={{ color: '#FFD144', width: '40px', height: '40px' }} />
        <Typography color="#fff" ml={3}>
          {contentMsg}
        </Typography>
      </Box>
    </Snackbar>
  );
}
