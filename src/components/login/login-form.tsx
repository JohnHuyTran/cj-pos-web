import React, { useEffect, useState } from 'react';

import clsx from 'clsx';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { loginKeyCloakAsync } from '../../store/slices/authSlice';
import { loginForm } from '../../models/user-interface';
import { loginFormStyle } from './loginForm-css';
import { env } from '../../adapters/environmentConfigs';
import { getAccessToken, setUserInfo } from '../../store/sessionStore';
import { getDecodedAccessToken } from '../../utils/utils';
import { KeyCloakTokenInfo } from '../../models/keycolak-token-info';
import { useTranslation } from 'react-i18next';
import { featchBranchListAsync } from '../../store/slices/search-branches-slice';

interface State {
  branch: string;
  userId: string;
  password: string;
  showPassword: boolean;
}

function LoginForm() {
  const classes = loginFormStyle();
  const { t } = useTranslation(['error', 'common']);
  const [values, setValues] = React.useState<State>({
    password: '',
    userId: '',
    showPassword: false,
    branch: '',
  });
  // console.log(isAllowPermission('FEATURE.ADMIN.SEARCH.DATA'));
  const dispatch = useAppDispatch();
  const { error, isLogin } = useAppSelector((state) => state.auth);
  const [version, setVersion] = React.useState<any>(process.env.REACT_APP_POS_BACK_VERSION);
  const handleChange = (prop: any) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onClickLogin = async () => {
    const form: loginForm = {
      userId: values.userId,
      password: values.password,
      branchCode: values.branch,
    };
    await dispatch(loginKeyCloakAsync(form));
    await dispatch(featchBranchListAsync());
  };

  return (
    <div className={classes.root}>
      <Typography variant='h5' className={classes.welcomeLabel}>
        ยินดีต้อนรับ
      </Typography>

      <Box className={classes.mainBox}>
        <div id='logo' className={classes.logo}>
          <img src='images/CJlogo.png' alt='' />
        </div>

        <div id='error'> {error && <p style={{ color: 'red', fontSize: '12px' }}>{t(error)}</p>}</div>
        <div>
          <FormControl sx={{ m: 3 }} className={clsx(classes.textField)} variant='outlined'>
            <FormHelperText id='outlined-user-id-text' sx={{ ml: 0 }}>
              รหัสผู้ใช้งาน
            </FormHelperText>
            <OutlinedInput
              id='txtUserid'
              value={values.userId}
              onChange={handleChange('userId')}
              aria-describedby='outlined-user-id-text'
              inputProps={{
                'aria-label': 'weight',
              }}
            />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ m: 3 }} className={clsx(classes.textField)} variant='outlined'>
            <FormHelperText id='outlined-password-text' sx={{ ml: 0 }}>
              รหัสผ่าน
            </FormHelperText>
            {/* <InputLabel htmlFor="outlined-adornment-password">
                  กรุณป้อนรหัสผ่าน
                </InputLabel> */}
            <OutlinedInput
              id='txtPassword'
              type={values.showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'>
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ m: 3 }} className={clsx(classes.textField)} variant='outlined'>
            <FormHelperText id='outlined-user-id-text' sx={{ ml: 0 }}>
              สาขา
            </FormHelperText>
            <OutlinedInput
              id='txtBranchCoce'
              value={values.branch}
              onChange={handleChange('branch')}
              aria-describedby='outlined-user-id-text'
              inputProps={{
                'aria-label': 'weight',
              }}
            />
          </FormControl>
        </div>
        <div>
          <Button
            sx={{ m: 3 }}
            id='btnLogin'
            variant='contained'
            color='primary'
            onClick={onClickLogin}
            className={classes.loginBtn}>
            <Typography variant='button' display='block' className={clsx(classes.labelLoginBtn, classes.textField)}>
              เข้าสู่ระบบ
            </Typography>
          </Button>
        </div>
        <Box
          sx={{
            width: '350px',
            height: '10px',
            display: 'flex',
            justifyContent: 'center',
            color: '#AEAEAE',
          }}>
          <Typography sx={{ fontSize: '10px', position: 'relative', top: '60px' }}>version: {version}</Typography>
        </Box>
      </Box>
    </div>
  );
}

export default LoginForm;
