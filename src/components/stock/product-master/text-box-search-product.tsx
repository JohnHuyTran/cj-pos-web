import { Autocomplete, CircularProgress, createFilterOptions, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useStyles } from '../../../styles/makeTheme';
import SearchIcon from '@mui/icons-material/Search';
import { searchProductItem } from '../../../services/product-master';

interface Props {
  onSelectItem: (value: any) => void;
  isClear: boolean;
}

function TextBoxSearchProduct({ onSelectItem, isClear }: Props) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searchItem, setSearchItem] = React.useState<any | null>(null);
  const [itemsList, setItemList] = React.useState([]);
  let options: any = [];
  if (searchItem) options = itemsList && itemsList.length > 0 ? itemsList : [];
  const filterOptions = createFilterOptions({
    stringify: (option: any) => option.barcodeName + option.barcode,
  });

  const autocompleteRenderListItem = (props: any, option: any) => {
    return (
      <li {...props} key={option.barcode}>
        <div>
          <Typography variant="body2">{option.barcodeName}</Typography>
          <Typography color="textSecondary" variant="caption">
            {option.barcode} / {option.skuCode}
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
              {loading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
        placeholder="รหัสสินค้า/ชื่อสินค้า/บาร์โค้ด"
        className={classes.MtextField}
        variant="outlined"
        size="small"
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
    if (reason == 'reset') {
      clearInput();
    }

    const keyword = value.trim();
    if (keyword.length >= 3 && reason !== 'reset') {
      setLoading(true);
      setSearchItem(keyword);
      try {
        const rs = await searchProductItem(keyword);
        if (rs) {
          setItemList(rs.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
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
      id="selAddItem"
      popupIcon={<SearchIcon color="primary" />}
      value={value}
      fullWidth
      // freeSolo
      loadingText="กำลังโหลด..."
      loading={loading}
      options={options}
      filterOptions={filterOptions}
      renderOption={autocompleteRenderListItem}
      onChange={handleChangeItem}
      onInputChange={onInputChange}
      getOptionLabel={(option) => (option.barcodeName ? option.barcodeName : '')}
      isOptionEqualToValue={(option, value) => option.barcodeName === value.barcodeName}
      renderInput={autocompleteRenderInput}
      size="small"
      className={classes.Mautocomplete}
      noOptionsText=""
    />
  );
}

export default TextBoxSearchProduct;
