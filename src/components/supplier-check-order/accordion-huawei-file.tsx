import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import theme from '../../styles/theme';
import { ApiError } from '../../models/api-error-model';
import { getFileUrlHuawei } from '../../services/purchase';
import ModalShowHuaweiFile from '../commons/ui/modal-show-huawei-file';

const AccordionHuaweiFile = () => {
  const [accordionFile, setAccordionFile] = useState<boolean>(false);
  const [displayFile, setDisplayFile] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [newFilename, setNewFilename] = useState<string>('test-rename');
  const [isImage, setIsImage] = useState(false);

  async function getHuaweiFileUrl(filekey: string, isImg: boolean) {
    await getFileUrlHuawei(filekey)
      .then((resp) => {
        if (resp && resp.data) {
          setFileUrl(resp.data);
          setIsImage(isImg);
          setNewFilename(filekey);
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
          onClick={() => setAccordionFile(!accordionFile)}
        >
          <Typography sx={{ fontSize: 18, color: '#676767' }}>เอกสารแนบ จำนวน 5/5</Typography>
          {accordionFile ? <KeyboardArrowUp color="primary" /> : <KeyboardArrowDown color="primary" />}
        </Box>

        <Box sx={{ mt: 1, display: accordionFile ? 'visible' : 'none' }}>
          {/* {[1, 2, 3, 4, 5].map((item, index) => (
            <Box
              key={`item-${index + 1}`}
              component="a"
              href={void 0}
              sx={{ color: theme.palette.secondary.main, cursor: 'pointer' }}
              onClick={getHuaweiFileUrl}
            >
              <Typography color="secondary" sx={{ textDecoration: 'underline' }}>
                PI21110101-INV123456-9999-1.pdf
              </Typography>
            </Box>
          ))} */}

          <Box
            component="a"
            href={void 0}
            sx={{ color: theme.palette.secondary.main, cursor: 'pointer' }}
            onClick={() => getHuaweiFileUrl('key.jpg', true)}
          >
            <Typography color="secondary" sx={{ textDecoration: 'underline' }}>
              key.jpg
            </Typography>
          </Box>

          <Box
            component="a"
            href={void 0}
            sx={{ color: theme.palette.secondary.main, cursor: 'pointer' }}
            onClick={() => getHuaweiFileUrl('SD21120002-000014-Draft.pdf', false)}
          >
            <Typography color="secondary" sx={{ textDecoration: 'underline' }}>
              SD21120002-000014-Draft.pdf
            </Typography>
          </Box>
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
