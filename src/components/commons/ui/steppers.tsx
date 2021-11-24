import React, { ReactElement, useEffect } from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import {
  Button,
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import { Box } from "@mui/system";

interface Props {
  status: number;
}

// const steps = ["บันทึก", "อนุมัติ", "ทดสอบ"];
const steps = ["บันทึก", "อนุมัติ"];

function Steppers({ status }: Props): ReactElement {
  // function Steppers(): ReactElement {
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    setActiveStep(status + 1);
  }, [open]);

  // const [skipped, setSkipped] = React.useState(new Set<number>());
  // const isStepSkipped = (step: number) => {
  //   return skipped.has(step);
  // };

  return (
    <div style={{ paddingBottom: 5 }}>
      {/* <Box sx={{ width: "40%", margin: "auto" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            // if (isStepSkipped(index)) {
            //   stepProps.completed = false;
            // }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box> */}

      <Box sx={{ width: "45%", margin: "auto", marginTop: "-1em" }}>
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
