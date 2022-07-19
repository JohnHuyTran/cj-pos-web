import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import theme from '../../../styles/theme';

interface Props {
  documentList: string[];
  type: string;
}

const AccordionHuaweiFile = ({ documentList, type }: Props) => {
  const [accordionFile, setAccordionFile] = useState<boolean>(false);

  return (
    <>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderRadius: '5px',
          border: `1px dashed ${theme.palette.primary.main}`,
        }}
      >
        <Box sx={{ display: accordionFile ? 'visible' : 'none' }}>
          {documentList &&
            documentList.length > 0 &&
            documentList.map((item, index) => (
              <Box
                key={`item-${index + 1}-${item}`}
                component="a"
                href={void 0}
                sx={{
                  color: theme.palette.secondary.main,
                  cursor: 'pointer',
                }}
              >
                <Typography
                  color="secondary"
                  sx={{ textDecoration: 'underline', fontSize: '13px', whiteSpace: 'normal' }}
                  noWrap
                >
                  {item}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </>
  );
};

export default AccordionHuaweiFile;
