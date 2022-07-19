import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import theme from '../../../styles/theme';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAppSelector } from '../../../store/store';

const DocumentList = () => {
  const [openListDocNo, setOpenListDocNo] = useState<boolean>(false);
  const dataDetail = useAppSelector((state) => state.auditPlanDetailSlice.auditPlanDetail.data);
  const relatedDocuments = dataDetail.relatedDocuments;

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
        <Box>
          <Box
            onClick={() => {
              setOpenListDocNo(!openListDocNo);
            }}
            // fontSize={'14px'}
            display={'flex'}
            justifyContent={'space-between'}
          >
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
              >
                <Typography
                  color="secondary"
                  sx={{ textDecoration: 'underline', fontSize: '14px', whiteSpace: 'normal', cursor: 'pointer' }}
                  noWrap
                >
                  {item.documentNumber} ครั้งที่ {item.countingTime}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </>
  );
};

export default DocumentList;
