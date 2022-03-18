import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { CircularProgress, InputAdornment } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import SearchIcon from '@mui/icons-material/Search';
import { featchDistrictsListAsync } from '../../../store/slices/search-districts-slice';

interface Props {
  provinceCode: string;
  onChangeDistricts: (districtsCode: string) => void;
  isClear: boolean;
  disable?: boolean;
}

function DistrictsDropDown({ provinceCode, onChangeDistricts, isClear, disable }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  let payload: any = {
    code: '',
    name: '',
    provinceCode: '',
  };
  useEffect(() => {
    if (provinceCode !== '') {
      payload = {
        provinceCode: provinceCode,
      };
      searchDistricts(payload);
    }
  }, [isClear, provinceCode]);

  const searchDistricts = async (payload: any) => {
    await dispatch(featchDistrictsListAsync(payload));
  };

  const districtsList = useAppSelector((state) => state.searchDistrictsSlice.districtsList);

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
        placeholder="กรุณากรอกเขต / อำเภอ"
        className={classes.MtextField}
        variant="outlined"
        size="small"
        fullWidth
      />
    );
  };

  let options: any = districtsList && districtsList.data && districtsList.data.length > 0 ? districtsList.data : [];
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
      return onChangeDistricts(option?.code ? option?.code : '');
    }
  };

  // const onInputChange = async (event: any, value: string, reason: string) => {
  //   if (event && event.keyCode && event.keyCode === 13) {
  //     return false;
  //   }

  //   const keyword = value.trim();
  //   if (keyword.length >= 3 && reason !== 'reset') {
  //     setLoading(true);

  //     payload = {
  //       code: '',
  //       name: keyword,
  //     };

  //     searchDistricts(payload);
  //     setLoading(false);
  //   }
  // };

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
      // onInputChange={onInputChange}
      getOptionLabel={(option) => (option.nameTH ? option.nameTH : '')}
      isOptionEqualToValue={(option, value) => option.nameTH === value.nameTH}
      renderInput={autocompleteRenderInput}
      disabled={disable ? true : false}
    />
  );
}

export default DistrictsDropDown;
