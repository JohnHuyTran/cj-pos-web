import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import theme from '../../styles/theme';
import { ApiError } from '../../models/api-error-model';
import { getFileUrlHuawei } from '../../services/purchase';
import ModalShowHuaweiFile from '../commons/ui/modal-show-huawei-file';
import { PurchaseDetailFiles } from '../../models/supplier-check-order-model';

interface Props {
  files: PurchaseDetailFiles[];
}

const AccordionHuaweiFile = ({ files }: Props) => {
  const [accordionFile, setAccordionFile] = useState<boolean>(false);
  const [displayFile, setDisplayFile] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [newFilename, setNewFilename] = useState<string>('test-rename');
  const [isImage, setIsImage] = useState(false);

  async function getHuaweiFileUrl(item: PurchaseDetailFiles) {
    await getFileUrlHuawei(item.filekey)
      .then((resp) => {
        if (resp && resp.data) {
          setFileUrl(resp.data);
          setIsImage(item.mimeType === 'image/jpeg');
          setNewFilename(item.filename);
          setDisplayFile(true);
        }
      })
      .catch((error: ApiError) => {
        console.log('error', error);
      });
  }

  return (
    <>
      <Box
        sx={{
          mt: 1,
          border: `1px dashed ${theme.palette.primary.main}`,
          px: 2,
          py: 1,
          borderRadius: 8,
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => {
            if (files.length > 0) setAccordionFile(!accordionFile);
          }}
        >
          <Typography sx={{ fontSize: 18, color: '#676767' }}>เอกสารแนบ จำนวน {files.length}/5</Typography>
          {accordionFile ? <KeyboardArrowUp color="primary" /> : <KeyboardArrowDown color="primary" />}
        </Box>

        <Box sx={{ mt: 1, display: accordionFile ? 'visible' : 'none' }}>
          {files.length > 0 &&
            files.map((item, index) => (
              <Box
                key={`item-${item.filekey}`}
                component="a"
                href={void 0}
                sx={{ color: theme.palette.secondary.main, cursor: 'pointer' }}
                onClick={() => getHuaweiFileUrl(item)}
              >
                <Typography color="secondary" sx={{ textDecoration: 'underline' }}>
                  {item.filename}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>

      <ModalShowHuaweiFile
        open={displayFile}
        onClose={() => setDisplayFile(false)}
        fileName={newFilename}
        url={fileUrl}
        isImage={isImage}
      />
    </>
  );
};

export default AccordionHuaweiFile;
