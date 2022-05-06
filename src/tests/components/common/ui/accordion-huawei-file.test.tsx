import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';

import AccordionHuaweiFile from '../../../../components/commons/ui/accordion-huawei-file';
import React from 'react';
import { FileType } from '../../../../models/supplier-check-order-model';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
});

describe('component tooltip', () => {
  it('find file name ', () => {
    const file: FileType = {
      fileKey: 'key1234',
      fileName: 'test.pdf',
      mimeType: 'application/pdf',
    };
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AccordionHuaweiFile files={[file]} />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByText(/test.pdf/)).toBeInTheDocument();
  });

  it('file not empty can click arrow icon ', () => {
    const file: FileType = {
      fileKey: 'key1234',
      fileName: 'test.pdf',
      mimeType: 'application/pdf',
    };
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AccordionHuaweiFile files={[file]} />
        </ThemeProvider>
      </Provider>
    );
    const arrow = screen.getByTestId('KeyboardArrowDownIcon');
    fireEvent.click(arrow);
    expect(screen.getByTestId('KeyboardArrowUpIcon')).toBeInTheDocument();
  });

  it('file empty not can click arrow icon ', () => {
    const file: FileType = {
      fileKey: 'key1234',
      fileName: 'test.pdf',
      mimeType: 'application/pdf',
    };
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AccordionHuaweiFile files={[]} />
        </ThemeProvider>
      </Provider>
    );
    const arrow = screen.getByTestId('KeyboardArrowDownIcon');
    fireEvent.click(arrow);
    expect(screen.queryByTestId('KeyboardArrowUpIcon')).toBeNull;
  });

  it('click file name ', () => {
    const file: FileType = {
      fileKey: 'key1234',
      fileName: 'test.pdf',
      mimeType: 'application/pdf',
    };
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AccordionHuaweiFile files={[file]} />
        </ThemeProvider>
      </Provider>
    );
    const arrow = screen.getByTestId('KeyboardArrowDownIcon');
    fireEvent.click(arrow);
    fireEvent.click(screen.getByText(/test.pdf/));
  });
});
