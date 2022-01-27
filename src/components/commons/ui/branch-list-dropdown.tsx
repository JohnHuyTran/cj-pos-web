import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { featchBranchListAsync } from '../../../store/slices/search-branches-slice';
import { BranchInfo } from '../../../models/search-branch-model';

interface branchListOptionType {
  name: string;
  code: string;
}

interface Props {
  valueBranch?: branchListOptionType | null;
  sourceBranchCode: string | null | undefined | '';
  onChangeBranch: (branchCode: string) => void;
  isClear: boolean;
}

function BranchListDropDown({ valueBranch, sourceBranchCode, onChangeBranch, isClear }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [valueBranchList, setValueBranchList] = React.useState<branchListOptionType | null>(null);
  let branchList = useAppSelector((state) => state.searchBranchSlice);
  useEffect(() => {
    if (branchList === null || branchList.branchList.data.length <= 0) dispatch(featchBranchListAsync());

    if (valueBranch) setValueBranchList(valueBranch);
    else setValueBranchList(null);
  }, [isClear]);

  const defaultPropsBranchList = {
    options: branchList.branchList.data.filter((branch: BranchInfo) => {
      return branch.code !== sourceBranchCode;
    }),
    getOptionLabel: (option: branchListOptionType) => option.name,
  };

  const handleChangeBranch = (event: any, newValue: branchListOptionType | null) => {
    setValueBranchList(newValue);
    return onChangeBranch(newValue?.code ? newValue.code : '');
  };

  return (
    <Autocomplete
      {...defaultPropsBranchList}
      className={classes.Mautocomplete}
      id="selBranchNo"
      value={valueBranchList}
      onChange={handleChangeBranch}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.code}>
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder="ทั้งหมด" size="small" className={classes.MtextField} fullWidth />
      )}
    />
  );
}

export default BranchListDropDown;
