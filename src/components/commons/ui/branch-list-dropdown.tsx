import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { featchBranchListAsync } from '../../../store/slices/search-branches-slice';
import { BranchInfo } from '../../../models/search-branch-model';
import { BranchListOptionType } from '../../../models/branch-model';

interface Props {
  valueBranch?: BranchListOptionType | null;
  sourceBranchCode: string | null | undefined | '';
  onChangeBranch: (branchCode: string) => void;
  isClear: boolean;
  disable?: boolean;
}

function BranchListDropDown({ valueBranch, sourceBranchCode, onChangeBranch, isClear, disable }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [valueBranchList, setValueBranchList] = React.useState<BranchListOptionType | null>(null);
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
    getOptionLabel: (option: BranchListOptionType) => `${option.code}-${option.name}`,
  };

  const handleChangeBranch = (event: any, newValue: BranchListOptionType | null) => {
    setValueBranchList(newValue);
    return onChangeBranch(newValue?.code ? newValue.code : '');
  };

  return (
    <Autocomplete
      {...defaultPropsBranchList}
      className={classes.Mautocomplete}
      noOptionsText='ไม่พอข้อมูล'
      id='selBranchNo'
      value={valueBranchList}
      onChange={handleChangeBranch}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.code}>
            {`${option.code}-${option.name}`}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder='ทั้งหมด' size='small' className={classes.MtextField} fullWidth />
      )}
      disabled={disable ? true : false}
    />
  );
}

export default BranchListDropDown;
