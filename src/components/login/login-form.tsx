import React, { useState } from 'react';

import {useAppSelector,useAppDispatch} from '../store/store';
import {loginKeyCloakAsync} from '../store/slices/authSlice';

import {loginForm} from '../types/userInterface';
import { isAllowPermission } from '../utils/utils';

function LoginForm() {
  const [values, setValues] = useState({
    password: "",
    userId: "",
    showPassword: false,
  });
  console.log(isAllowPermission('FEATURE.ADMIN.SEARCH.DATA'));
  const dispatch = useAppDispatch()
  const {  error } = useAppSelector((state) => state.auth)


  const handleChange = (prop:any) => (event:any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const onClickLogin = () => {
    const form: loginForm = {
      userId : values.userId,
      password : values.password
    }
      dispatch(loginKeyCloakAsync(form))
    }

    return (
<div className='form'>
            <input
                type='text'
                name='userId'
                value={values.userId}
                onChange={handleChange("userId")}
            />
            <input
                type='password'
                name='password'
                value={values.password}
                onChange={handleChange("password")}
            />
            <button onClick={onClickLogin}>
                {'Submit'}
            </button>

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        </div>
      );
}

export default LoginForm
