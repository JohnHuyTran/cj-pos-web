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
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { useAppDispatch } from "../../store/store";
import { changeState } from "../../store/slices/supplier-selection-slice";
import { typography } from "@mui/system";

const mockDataset = [
  {
    label: "บริษัท เบทาโกรการเกษตรอุตสาหกรรม จำกัด",
    code: "401212254",
    po: ["401212254", "401224456", "P121100101-000163"],
  },
  {
    label: "บริษัท เบทาไมค์อิเล็กทริคจำกัด",
    code: "401224456",
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
      padding: theme.spacing(1.8),
    },
  },
  MBtnAddSupplier: {
    borderRadius: "5px !important",
  },
  textLabelInput: { fontSize: 14, fontWeight: 400 },
  textListSupplier: {
    fontSize: 15,
    fontWeight: 700,
  },
  textItemList: {
    fontSize: 14,
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
      <Typography sx={{ fontSize: 24 }}>{children}</Typography>
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
  const [hasPO, setHasPO] = React.useState<boolean>(false);
  const [hasPOValue, setHasPOValue] = React.useState<string>("");

  const autocompleteRenderListItem = (props: any, option: any) => {
    return (
      <List {...props} sx={{ width: "100%" }} key={option.code}>
        <ListItem alignItems="flex-start" disablePadding>
          <ListItemText primary={option.label} secondary={option.code} />
        </ListItem>
      </List>
    );
  };

  const onChangeSelection = (_: any, value: any) => {
    if (value) {
      if (value.po && value.po.length > 0) {
        setHasPO(true);
        setHasPOValue("มีเอกสาร PO");
      } else {
        setHasPO(false);
        setHasPOValue("ไม่มีมีเอกสาร PO");
      }
    } else {
      setHasPO(false);
      setHasPOValue("");
    }
  };

  const onSubmitData = () => {
    setHasPO(false);
    setHasPOValue("");
    handleCloseModal();
    dispatch(changeState(mockDataset[0]));
  };

  const onCloseModal = () => {
    setHasPO(false);
    setHasPOValue("");
    handleCloseModal();
  };

  const filterOptions = createFilterOptions({
    stringify: (option: any) => option.label + option.code,
  });

  return (
    <div>
      <BootstrapDialog
        // onClose={onCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        open={openModal}
        fullWidth
        maxWidth="sm"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={onCloseModal}
        >
          เพิ่มผู้จำหน่าย
        </BootstrapDialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 3 }}>
              <label className={classes.textLabelInput}>ผู้จำหน่าย</label>
              <Autocomplete
                id="searchSupplierModal"
                fullWidth
                freeSolo
                sx={{ mt: 1 }}
                options={mockDataset}
                filterOptions={filterOptions}
                renderOption={autocompleteRenderListItem}
                onChange={onChangeSelection}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="รหัสผู้จำหน่าย/ชื่อผู้จำหน่าย"
                    className={classes.MTextField}
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box sx={{ flex: 2, ml: 2 }}>
              <label className={classes.textLabelInput}>ประเภทผู้จำหน่าย</label>
              <TextField
                id="supplierModalType"
                sx={{ mt: 1 }}
                className={classes.MTextField}
                value={hasPOValue}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 4, visibility: hasPO ? "visible" : "hidden" }}>
            <label className={classes.textListSupplier}>
              รายการเอกสารใบสั่งซื้อ PO
            </label>

            <RadioGroup
              name="use-radio-group"
              defaultValue="first"
              id="listSupplierDocPO"
            >
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
              onClick={onSubmitData}
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
