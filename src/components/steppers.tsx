import {
  styled,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Check } from '@mui/icons-material'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

interface SteppersProps {
  steps: Array<any>,
  actionStep: number
}

interface QontoStepIconProps {
  active: string,
  completed: string ,
  className: string
}

interface QontoStepIconRootProps {
  activeState?: any
}

export default function Steppers(props: SteppersProps) {
  const { steps, actionStep } = props
  
  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper alternativeLabel activeStep={actionStep} connector={<QontoConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}

const QontoStepIcon = (props: QontoStepIconProps) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot activeState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#36c690',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#36c690',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#EAEBEB',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')<QontoStepIconRootProps>(({ theme, activeState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#EAEBEB',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(activeState.active && {
    color: '#36c690',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#36c690',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));