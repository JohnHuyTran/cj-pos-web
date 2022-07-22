import { Fragment, useState } from "react";
import { useStyles } from '../../../styles/makeTheme';

// Components
import ModalSettingExpense from './modal-settings-expense';
import LoadingModal from '../../commons/ui/loading-modal';

import { 
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';

export default function SearchReserves () {
  const classes = useStyles();
  const types = [
    {key: 'ALL', text: 'ทั้งหมด'},
    {key: 'COFFEE', text: 'ค่าใช้จ่ายร้านกาแฟ'},
    {key: 'STOREFRONT', text: 'ค่าใช้จ่ายหน้าร้าน'}
  ]
  const statusList = [
    {key: 'ALL', text: 'ทั้งหมด'},
    {key: 'ENABLE', text: 'ใช้งาน'},
    {key: 'DISABLE', text: 'ไม่ได้ใช้งาน'}
  ]

  const initialSearchState = {
    type: 'ALL',
    status: 'ALL'
  }
  
  // Set state data
  const [search, setSearch] = useState(initialSearchState);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenLoading, setIsOpenLoading] = useState(false);

  // Handle function
  const handleClearSearch = () => {
    setSearch(initialSearchState)
    // setIsDisabled(false)
  }
  
  const handleSearchExpense = () => {
    setIsOpenLoading(true)
    setTimeout(() => {
      setIsOpenLoading(false)
    }, 500)
  }
  
  const handleAddList = () => {
    setIsOpenModal(true)
  }

  return(
    <Fragment>
      <Grid container rowSpacing={1} columnSpacing={7}>
        <ModalSettingExpense
          isOpen={isOpenModal}
          onClickClose={() => setIsOpenModal(false)} />
        <Grid item md={4} sm={4} xs={6}>
          <Typography variant="subtitle1" component="div" mb={1}>
            ประเภท
          </Typography>
          <FormControl id="SearchType" className={classes.Mselect} fullWidth>
            <Select
              id="Type"
              name="type"
              value={search.type}
              disabled={isOpenLoading}
              onChange={(e) => setSearch({...search, type: e.target.value})}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {types.map((item, index: number) => (
                <MenuItem key={index} value={item.key}>
                  {item.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={4} sm={4} xs={6}>
          <Typography variant="subtitle1" component="div" mb={1}>
            สถานะ
          </Typography>
          <FormControl id="SearchType" className={classes.Mselect} fullWidth>
            <Select
              id="Status"
              name="status"
              value={search.status}
              disabled={isOpenLoading}
              onChange={(e) => setSearch({...search, status: e.target.value})}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {statusList.map((item, index: number) => (
                <MenuItem key={index} value={item.key}>
                  {item.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item mt={10} mb={5} xs={12} sx={{ textAlign: 'right' }}>
          <Button
            id="btnCoffee"
            variant="contained"
            color="primary"
            disabled={isOpenLoading}
            onClick={handleAddList}
            startIcon={<AddCircleOutline />}
            sx={{
              width: '170.42px',
              mr: 2,
              background: '#5468ff',
              ':hover': { boxShadow: 6, background: '#3e4cb8' },
            }}
            className={classes.MbtnSearch}
          >
            ค่าใช้จ่ายร้านกาแฟ
          </Button>
          <Button
            id="btnClear"
            variant="contained"
            disabled={isOpenLoading}
            onClick={handleClearSearch}
            sx={{ width: '170.42px' }}
            className={classes.MbtnClear}
            color="cancelColor"
          >
            เคลียร์
          </Button>
          <Button
            id="btnSearch"
            variant="contained"
            color="primary"
            disabled={isOpenLoading}
            onClick={handleSearchExpense}
            sx={{ width: '170.42px', ml: 2 }}
            className={classes.MbtnSearch}
          >
            ค้นหา
          </Button>
        </Grid>
        <LoadingModal open={isOpenLoading} />
      </Grid>
    </Fragment>
  )
}