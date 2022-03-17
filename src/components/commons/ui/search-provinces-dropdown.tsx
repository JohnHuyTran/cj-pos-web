import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { featchBranchListAsync } from '../../../store/slices/search-branches-slice';
import { BranchInfo } from '../../../models/search-branch-model';
// import { BranchListOptionType } from '../../../models/branch-model';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { featchAuthorizedBranchListAsync } from '../../../store/slices/authorized-branch-slice';
import { ProvincesInfo } from '../../../models/search-provinces-model';

export interface ProvincesListOption {
  code: string;
  nameTH: string;
  nameEN: string;
}

interface Props {
  valueProvinces?: ProvincesListOption | null;
  sourceProvincesCode?: string | null | undefined | '';
  // onChangeBranch: (branchCode: string) => void;
  isClear: boolean;
  // disable?: boolean;
  // filterOutDC?: boolean;
  // isFilterAuthorizedBranch?: boolean;
}

function ProvincesDropDown({
  valueProvinces,
  sourceProvincesCode,
  // onChangeBranch,
  isClear,
}: // disable,
// filterOutDC,
// isFilterAuthorizedBranch,
Props) {
  const classes = useStyles();

  const [valueProvincesList, setValueProvincesList] = React.useState<ProvincesListOption | null>(null);
  let provincesList = useAppSelector((state) => state.searchProvincesSlice);
  console.log('provincesList :', JSON.stringify(provincesList));

  useEffect(() => {}, [isClear]);

  // const defaultPropsProvincesList = {
  //   options: provincesList.provincesList.data.filter((provinces: ProvincesInfo) => {
  //     return provinces.code !== sourceProvincesCode;
  //     // return provinces.code !== sourceBranchCode && filterAuthorizedBranch(branch) && filterDC(branch);
  //   }),
  //   getOptionLabel: (option: ProvincesListOption) => `${option.code}-${option.nameTH}`,
  // };

  // const handleChangeProvinces = (event: any, newValue: ProvincesListOption | null) => {
  // const handleChangeProvinces = (event: any, newValue: any) => {
  // console.log('newValue:', newValue);
  // setValueProvincesList(newValue.nameTH);

  // setValueBranchList(newValue);
  // return onChangeBranch(newValue?.code ? newValue.code : '');
  // };

  return (
    // <Autocomplete
    //   {...defaultPropsProvincesList}
    //   className={classes.Mautocomplete}
    //   popupIcon={<SearchIcon />}
    //   noOptionsText="ไม่พอข้อมูล"
    //   id="selBranchNo"
    //   // value={valueBranchList}
    //   // onChange={handleChangeBranch}
    //   renderOption={(props, option) => {
    //     return (
    //       <li {...props} key={option.code}>
    //         {`${option.code}-${option.nameTH}`}
    //       </li>
    //     );
    //   }}
    //   renderInput={(params) => (
    //     <TextField
    //       {...params}
    //       placeholder="ทั้งหกรุณาเลือกจังหวัดมด"
    //       size="small"
    //       className={classes.MtextField}
    //       fullWidth
    //       InputProps={{
    //         ...params.InputProps,
    //         endAdornment: (
    //           <InputAdornment position="start">
    //             <SearchIcon />
    //           </InputAdornment>
    //         ),
    //       }}
    //     />
    //   )}
    //   // disabled={disable ? true : false}
    // />

    <Autocomplete
      options={provincesList.provincesList.data}
      className={classes.Mautocomplete}
      popupIcon={<SearchIcon />}
      noOptionsText="ไม่พอข้อมูล"
      id="selProvinces"
      // value={valueProvincesList}
      // onChange={handleChangeProvinces}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.code}>
            {option.nameTH}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="กรุณาเลือกจังหวัด"
          size="small"
          className={classes.MtextField}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />

    // <Autocomplete
    //   {...defaultPropsBranchList}
    //   className={classes.Mautocomplete}
    //   popupIcon={<SearchIcon />}
    //   noOptionsText='ไม่พอข้อมูล'
    //   id='selBranchNo'
    //   value={valueBranchList}
    //   onChange={handleChangeBranch}
    //   renderOption={(props, option) => {
    //     return (
    //       <li {...props} key={option.code}>
    //         {`${option.code}-${option.name}`}
    //       </li>
    //     );
    //   }}
  );
}

export default ProvincesDropDown;
