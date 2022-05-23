import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import React from 'react';
import { initialState } from "../../mockStore";
import { mockUserInfo } from "../../mockData";
import { ThemeProvider } from "@mui/material";
import theme from "../../../styles/theme";
import ModalCheckStock from "../../../components/barcode-discount/modal-check-stock";

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
const onClose = jest.fn();
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
  wrapper = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalCheckStock
          open={true}
          onClose={onClose}
        />
      </ThemeProvider>
    </Provider>
  );
});

describe('component check stock', () => {
  it('find button close', () => {
    expect(screen.getByText('ปิด')).toBeInTheDocument();
    fireEvent.click(screen.getByText('ปิด'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('find data stock', () => {
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).toContainHTML('18857122754576');
  });
});
