import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { CircularProgress, InputAdornment } from '@mui/material';
import { useStyles } from '../../../styles/makeTheme';
import { useAppSelector, useAppDispatch } from '../../../store/store';
import { featchProvincesListAsync } from '../../../store/slices/search-provinces-slice';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  onChangeProvinces: (provincesCode: string) => void;
  searchProvincesCode: string;
  isClear: boolean;
  disable?: boolean;
}

function ProvincesDropDown({ onChangeProvinces, searchProvincesCode, isClear, disable }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [values, setValues] = React.useState<string[]>([]);

  let payload: any = {
    code: '',
    name: '',
  };

  useEffect(() => {
    if (isClear) setValues([]);

    if (searchProvincesCode !== '') {
      payload = {
        code: searchProvincesCode,
      };
    }

    searchProvinces(payload);
  }, [isClear, searchProvincesCode]);

  const searchProvinces = async (payload: any) => {
    await dispatch(featchProvincesListAsync(payload));
  };

  const provincesList = useAppSelector((state) => state.searchProvincesSlice.provincesList);

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
        placeholder="กรุณากรอกจังหวัด"
        className={classes.MtextFieldAutocomplete}
        size="small"
        fullWidth
      />
    );
  };

  let options: any = provincesList && provincesList.data && provincesList.data.length > 0 ? provincesList.data : [];
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
      return onChangeProvinces(option?.code ? option?.code : '');
    }
  };

  if (options.length === 1 && values.length === 0 && !isClear) {
    setValues(options[0]);
    handleChangeItem('', options[0], 'selectOption');
  }

  return (
    <Autocomplete
      id="selAddItem"
      value={values}
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

export default ProvincesDropDown;
