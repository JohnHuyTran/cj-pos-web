import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useStyles } from '../../styles/makeTheme';
import { ReactElement } from 'react';

interface Props {
  activeStep: number;
  setActiveStep: (activeStep: number) => void;
}
const steps = ['บันทึก', 'เริ่มใช้งาน', 'ครบกำหนด'];

export default function StepperBar({ activeStep, setActiveStep }: Props): ReactElement {
  const [cancel, setCancel] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (activeStep === 4) {
      setCancel(true);
      setActiveStep(2);
    }
  }, [activeStep, open]);

  const classes = useStyles();
  return (
    <div className={classes.MStepper} style={{ paddingBottom: 5 }}>
      <Box sx={{ width: '45%', margin: 'auto', marginTop: '-1em' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const labelProps: any = {};
            if (index === 1 && cancel) {
              label = 'ยกเลิก';
              labelProps.error = true;
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
