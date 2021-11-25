import React, { ReactElement, useEffect } from "react";
import { Step, StepLabel, Stepper } from "@mui/material";
import { Box } from "@mui/system";
import { useStyles } from "../../../styles/makeTheme";

interface Props {
  status: number;
}

const steps = ["บันทึก", "อนุมัติ"];

function Steppers({ status }: Props): ReactElement {
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    setActiveStep(status + 1);
  }, [open]);

  const classes = useStyles();
  return (
    <div className={classes.MStepper} style={{ paddingBottom: 5 }}>
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
