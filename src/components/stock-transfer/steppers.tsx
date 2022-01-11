import React, { ReactElement, useEffect } from 'react';
import { Step, StepLabel, Stepper } from '@mui/material';
import { Box } from '@mui/system';
import { useStyles } from '../../styles/makeTheme';

interface Props {
  status: number;
}

const steps = ['บันทึก', 'อยู่ระหว่างดำเนินการ: สร้างใบงาน', 'อนุมัติ'];

function Steppers({ status }: Props): ReactElement {
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    // setActiveStep(status + 1);
    setActiveStep(status);
  }, [open]);

  const classes = useStyles();
  return (
    <div className={classes.MStepper} style={{ paddingBottom: 5 }}>
      <Box sx={{ width: '50%', margin: 'auto', marginTop: '-1em' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
}

export default Steppers;
