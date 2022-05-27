import { render, screen, waitFor, fireEvent, RenderResult, getByTestId, within, wait } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import { inputAdornmentClasses, TextField, ThemeProvider, Typography } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';

import DatePickerComponent from '../../../../components/commons/ui/date-picker-v2';
import React from 'react';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
});

describe('component date picker v2', () => {
  it('on start date ', () => {
    const handleOnClick = jest.fn();
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DatePickerComponent onClickDate={handleOnClick} value={new Date()} />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.queryByTestId(/StartDate/)).toBeInTheDocument();
  });

  it('on end date ', () => {
    const handleOnClick = jest.fn();
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DatePickerComponent onClickDate={handleOnClick} value={new Date()} type="TO" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.queryByTestId(/EndDate/)).toBeInTheDocument();
  });
});
