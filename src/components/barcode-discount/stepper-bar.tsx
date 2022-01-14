import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['บันทึก', 'รออนุมัติ', 'อนุมัติ', 'พิมพ์บาร์โค้ดแล้ว'];

export default function StepperBar() {
  return (
    <Box sx={{ width: "50%", margin: "0 auto" }}>
      <Stepper activeStep={0} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
