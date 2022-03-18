import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { CircularProgress, InputAdornment, Typography } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { featchProvincesListAsync } from '../../../store/slices/search-provinces-slice';
import SearchIcon from '@mui/icons-material/Search';
import { featchDistrictsListAsync } from '../../../store/slices/search-districts-slice';
import { featchsSubDistrictsListAsync } from '../../../store/slices/search-subDistricts-slice';

interface Props {
  districtsCode: string;
  onChangeSubDistricts: (subDistrictsCode: string, postalCode: string) => void;
  isClear: boolean;
  disable?: boolean;
}

function SubDistrictsDropDown({ districtsCode, onChangeSubDistricts, isClear, disable }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  let payload: any = {
    code: '',
    name: '',
    districtCode: '',
    postalCode: '',
  };
  useEffect(() => {
    if (districtsCode !== '') {
      payload = {
        districtCode: districtsCode,
      };
      searchSubDistricts(payload);
    }
  }, [isClear, districtsCode]);

  const searchSubDistricts = async (payload: any) => {
    await dispatch(featchsSubDistrictsListAsync(payload));
  };

  const subDistrictsList = useAppSelector((state) => state.searchSubDistrictsSlice.subDistrictsList);

  const [loading, setLoading] = React.useState(false);
  const autocompleteRenderInput = (params: any) => {
    return (
      <TextField
        {...params}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {/* {params.InputProps.endAdornment} */}
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            </React.Fragment>
          ),
        }}
        placeholder="กรุณากรอกแขวง / ตำบล"
        className={classes.MtextField}
        variant="outlined"
        size="small"
        fullWidth
      />
    );
  };

  let options: any =
    subDistrictsList && subDistrictsList.data && subDistrictsList.data.length > 0 ? subDistrictsList.data : [];
  const filterOptions = createFilterOptions({
    stringify: (option: any) => option.nameTH,
  });

  const autocompleteRenderListItem = (props: any, option: any) => {
    return (
      <li {...props} key={option.code}>
        {option.nameTH}
      </li>
    );
  };

  const handleChangeItem = async (event: any, option: any, reason: string) => {
    if (option && reason === 'selectOption') {
      return onChangeSubDistricts(option?.code ? option?.code : '', option?.postalCode ? option?.postalCode : '');
    }
  };

  return (
    <Autocomplete
      id="selAddItem"
      fullWidth
      freeSolo
      loadingText="กำลังโหลด..."
      loading={loading}
      options={options}
      filterOptions={filterOptions}
      renderOption={autocompleteRenderListItem}
      onChange={handleChangeItem}
      getOptionLabel={(option) => (option.nameTH ? option.nameTH : '')}
      isOptionEqualToValue={(option, value) => option.nameTH === value.nameTH}
      renderInput={autocompleteRenderInput}
      disabled={disable ? true : false}
    />
  );
}

export default SubDistrictsDropDown;
