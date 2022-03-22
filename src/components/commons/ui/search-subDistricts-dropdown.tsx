import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { CircularProgress, InputAdornment } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import SearchIcon from '@mui/icons-material/Search';
import { featchsSubDistrictsListAsync } from '../../../store/slices/search-subDistricts-slice';

interface Props {
  valueSubDistricts: string;
  districtsCode: string;
  onChangeSubDistricts: (subDistrictsCode: string, postalCode: string, districtCode: string) => void;
  searchPostalCode: string;
  isClear: boolean;
  disable?: boolean;
}

function SubDistrictsDropDown({
  valueSubDistricts,
  districtsCode,
  onChangeSubDistricts,
  searchPostalCode,
  isClear,
  disable,
}: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [values, setValues] = React.useState<string[]>([]);
  const subDistrictsList = useAppSelector((state) => state.searchSubDistrictsSlice.subDistrictsList);

  let payload: any = {
    code: '',
    name: '',
    districtCode: '',
    postalCode: '',
  };
  useEffect(() => {
    if (isClear) setValues([]);

    if (searchPostalCode !== '') {
      payload = {
        postalCode: searchPostalCode,
      };
      searchSubDistricts(payload);
    } else if (districtsCode !== '') {
      payload = {
        districtCode: districtsCode,
      };
      searchSubDistricts(payload);
    }

    if (valueSubDistricts !== '') {
      const valueFilter: any = subDistrictsList.data.filter((r: any) => r.code === Number(valueSubDistricts));
      if (valueFilter) {
        setValues(valueFilter[0]);
      }
    }
  }, [isClear, districtsCode, searchPostalCode, subDistrictsList]);

  const searchSubDistricts = async (payload: any) => {
    await dispatch(featchsSubDistrictsListAsync(payload));
  };

  const [loading, setLoading] = React.useState(false);
  const autocompleteRenderInput = (params: any) => {
    return (
      <TextField
        {...params}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading ? <CircularProgress color='inherit' size={20} /> : null}
              {/* {params.InputProps.endAdornment} */}
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            </React.Fragment>
          ),
        }}
        placeholder='กรุณากรอกแขวง / ตำบล'
        className={classes.MtextFieldAutocomplete}
        variant='outlined'
        size='small'
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
      return onChangeSubDistricts(
        option?.code ? option?.code : '',
        option?.postalCode ? option?.postalCode : '',
        option?.districtCode ? option?.districtCode : ''
      );
    }
  };

  // if (options.length === 1 && values.length === 0 && !isClear) {
  //   setValues(options[0]);
  //   handleChangeItem('', options[0], 'selectOption');
  // }

  return (
    <Autocomplete
      id='selAddItem'
      value={values}
      fullWidth
      freeSolo
      loadingText='กำลังโหลด...'
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
