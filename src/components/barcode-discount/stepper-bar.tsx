import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useStyles } from "../../styles/makeTheme";
import { ReactElement } from "react";
import { Typography } from "@material-ui/core";

interface Props {
  status: number;
}
const steps = ["บันทึก", "รออนุมัติ", "อนุมัติ", "พิมพ์บาร์โค้ดแล้ว"];

export default function StepperBar({ status }: Props): ReactElement {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    setActiveStep(status === 5 ? 3 : status);
  }, [open]);

  const classes = useStyles();
  return (
    <div className={classes.MStepper} style={{ paddingBottom: 5 }}>
      <Box sx={{ width: "45%", margin: "auto", marginTop: "-1em" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const labelProps: any = {};
            if (index === 2 && status === 5) {
              label = "ไม่อนุมัต";
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
