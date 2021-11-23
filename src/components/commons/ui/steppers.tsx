import React, { ReactElement } from "react";
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

// interface Props {
//   isOpen: boolean;
//   supplierId: string;
//   onClickClose: () => void;
// }

const steps = ["บันทึก", "อนุมัติ"];

// function Steppers({ isOpen, supplierId, onClickClose }: Props): ReactElement {
function Steppers(): ReactElement {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  return (
    <div>
      <Box sx={{ width: "50%", margin: "auto" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </div>
  );
}

export default Steppers;
