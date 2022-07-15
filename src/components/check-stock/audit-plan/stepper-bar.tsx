import * as React from 'react';
import { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useStyles } from '../../../styles/makeTheme';
import { StockActionStatus } from '../../../utils/enum/common-enum';

interface Props {
  activeStep: any;
  setActiveStep: (activeStep: string) => void;
}

const steps = [StockActionStatus.DRAFT, StockActionStatus.CONFIRM, StockActionStatus.COUNTING, StockActionStatus.END];

export default function StepperBar({ activeStep, setActiveStep }: Props): ReactElement {
  const classes = useStyles();
  return (
    <div className={classes.MStepper} style={{ paddingBottom: 5 }}>
      <Box sx={{ width: '45%', margin: 'auto', marginTop: '-1em' }}>
        <Stepper activeStep={steps.indexOf(activeStep) + 1} alternativeLabel>
          {steps.map((status, index) => {
            const labelProps: any = {};
            let label: string = '';
            switch (index) {
              case 0:
                label = 'บันทึก';
                break;
              case 1:
                label = 'ยืนยัน';
                break;
              case 2:
                label = 'เริ่มตรวจนับ';
                break;
              case 3:
                label = 'ปิดงาน';
                break;
            }
            return (
              <Step key={label}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </div>
  );
}
