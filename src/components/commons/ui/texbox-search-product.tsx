import { Autocomplete, CircularProgress, createFilterOptions, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { newSearchAllProductAsync, searchAllProductAsync } from '../../../store/slices/search-type-product-slice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import SearchIcon from '@mui/icons-material/Search';
import { FindProductProps, FindProductRequest } from '../../../models/product-model';

interface Props {
  // skuType?: any[];
  onSelectItem: (value: any) => void;
  isClear: boolean;
  requestBody: FindProductRequest;
}

function TextBoxSearchProduct({ onSelectItem, isClear, requestBody }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searchItem, setSearchItem] = React.useState<any | null>(null);
  const itemsList = useAppSelector((state) => state.searchTypeAndProduct.itemList);
  let options: any = [];
  if (searchItem) options = itemsList && itemsList.data && itemsList.data.length > 0 ? itemsList.data : [];
  const filterOptions = createFilterOptions({
    stringify: (option: any) => option.barcodeName + option.barcode,
  });

  const autocompleteRenderListItem = (props: any, option: any) => {
    return (
      <li {...props} key={option.barcode}>
        <div>
          <Typography variant='body2'>{option.barcodeName}</Typography>
          <Typography color='textSecondary' variant='caption'>
            {option.barcode}
          </Typography>
        </div>
      </li>
    );
  };
  const autocompleteRenderInput = (params: any) => {
    return (
      <TextField
        {...params}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading ? <CircularProgress color='inherit' size={20} /> : null}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
        placeholder='บาร์โค้ด/รายละเอียดสินค้า'
        className={classes.MtextField}
        variant='outlined'
        size='small'
        fullWidth
      />
    );
  };
  const handleChangeItem = async (event: any, option: any, reason: string) => {
    setValue(option);
    onSelectItem(option);
  };

  const clearData = async () => {
    setValue('');
  };

  const clearInput = () => {};
  const onInputChange = async (event: any, value: string, reason: string) => {
    if (event && event.keyCode && event.keyCode === 13) {
      return false;
    }
    // console.log('onInputChange', { reason, value });
    // if (reason == 'reset') {
    //   clearInput();
    // }

    const keyword = value.trim();
    if (keyword.length >= 3 && reason !== 'reset') {
      setLoading(true);
      setSearchItem(keyword);

      const payload: FindProductProps = {
        search: keyword,
        payload: requestBody,
      };
      await dispatch(newSearchAllProductAsync(payload));

      setLoading(false);
    } else {
      clearData();
    }
  };

  useEffect(() => {
    if (isClear) {
      setValue('');
    }
  }, [isClear]);

  return (
    <Autocomplete
      id='selAddItem'
      popupIcon={<SearchIcon color='primary' />}
      value={value}
      fullWidth
      // freeSolo
      loadingText='กำลังโหลด...'
      loading={loading}
      options={options}
      filterOptions={filterOptions}
      renderOption={autocompleteRenderListItem}
      onChange={handleChangeItem}
      onInputChange={onInputChange}
      getOptionLabel={(option) => (option.barcodeName ? option.barcodeName : '')}
      isOptionEqualToValue={(option, value) => option.barcodeName === value.barcodeName}
      renderInput={autocompleteRenderInput}
      size='small'
      className={classes.Mautocomplete}
      noOptionsText=''
    />
  );
}

export default TextBoxSearchProduct;
