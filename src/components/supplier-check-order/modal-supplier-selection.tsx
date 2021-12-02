import React from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { changeState } from "../../store/slices/supplier-selection-slice";

const mockDataset = [
  {
    company: "บริษัท เบทาโกรการเกษตรอุตสาหกรรม จำกัด",
    code: "401212254",
    po: ["401212254", "401224456", "P121100101-000163"],
  },
  {
    company: "บริษัท เบทาไมค์อิเล็กทริคจำกัด",
    code: "401212254",
    po: ["401212254", "401224456", "P121100101-000163"],
  },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
}));

const useStyles = makeStyles((theme) => ({
  MTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "5px !important",
      padding: theme.spacing(1),
    },
  },
  MBtnAddSupplier: {
    borderRadius: "5px !important",
  },
  textLabelInput: { fontSize: 14, fontWeight: 700 },
  textListSupplier: {
    fontSize: 16,
    fontWeight: 700,
  },
  textItemList: {
    fontSize: 15,
  },
}));

interface StyledFormControlLabelProps extends FormControlLabelProps {
  checked: boolean;
}

const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  ".MuiFormControlLabel-label": checked && {
    color: theme.palette.primary.main,
  },
}));

function MyFormControlLabel(props: FormControlLabelProps) {
  const radioGroup = useRadioGroup();
  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

interface Props {
  openModal: boolean;
  handleCloseModal: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.cancelColor.main,
          }}
        >
          <CancelOutlinedIcon
            fontSize="large"
            stroke={"white"}
            stroke-width={1}
          />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function ModalSupplierSelection({
  openModal,
  handleCloseModal,
}: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  function onSelectionData() {
    handleCloseModal();
    dispatch(changeState(mockDataset[0]));
  }

  return (
    <div>
      <BootstrapDialog
        // onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        open={openModal}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          เพิ่มผู้จัดจำหน่าย
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 3 }}>
              <label className={classes.textLabelInput}>ผู้จำหน่าย</label>
              <TextField
                id="outlined-basic"
                variant="outlined"
                className={classes.MTextField}
                sx={{ width: "100%" }}
                placeholder="รหัสผู้จำหน่าย/ชื่อผู้จำหน่าย"
              />
            </Box>
            <Box sx={{ flex: 2, ml: 2 }}>
              <label className={classes.textLabelInput}>ประเภทผู้จำหน่าย</label>
              <TextField
                id="outlined-basic"
                variant="outlined"
                className={classes.MTextField}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 4, visibility: "visible" }}>
            <label className={classes.textListSupplier}>
              รายการเอกสารใบสั่งซื้อ
            </label>

            <RadioGroup name="use-radio-group" defaultValue="first">
              <MyFormControlLabel
                value="401212254"
                label="401212254"
                control={<Radio />}
              />
              <MyFormControlLabel
                value="401224456"
                label="401224456"
                control={<Radio />}
              />
            </RadioGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              p: 1,
            }}
          >
            <Button
              id="btnAddSupplier"
              variant="contained"
              color="secondary"
              onClick={onSelectionData}
              className={classes.MBtnAddSupplier}
              disabled={false}
            >
              เพิ่มผู้จำหน่าย
            </Button>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
