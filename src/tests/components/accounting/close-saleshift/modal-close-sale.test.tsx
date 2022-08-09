import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';
import ModalCloseSale from '../../../../components/accounting/close-saleshift/modal-close-sale';
import { ThemeProvider } from '@mui/material';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
const handleOnClose = jest.fn();
const noOfShiftKey = '8';
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
  wrapper = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalCloseSale open={true} onClose={handleOnClose} noOfShiftKey={noOfShiftKey} />
      </ThemeProvider>
    </Provider>
  );
});

describe('component modal close sale', () => {
  // console.debug('debug:', inputField);
  it('find button ตกลง', () => {
    expect(screen.getByTestId(/testid-btnSubmit/)).toBeInTheDocument();
    let btnClose = screen.getByTestId(/testid-btnSubmit/);
    expect(btnClose.textContent).toEqual('ตกลง');
  });

  it('find text', () => {
    expect(screen.getByTestId(/testid-label-noOfShiftKey/)).toBeInTheDocument();
    let txtContent = screen.getByTestId(/testid-label-noOfShiftKey/);
    expect(txtContent.textContent).toEqual(`จำนวนรหัสปิดรอบ:${noOfShiftKey} `);
    // expect(screen.getByText(`จำนวนรหัสปิดรอบ: 8`)).toBeInTheDocument();
  });

  it('on click btn ตกลง', () => {
    fireEvent.click(screen.getByTestId(/testid-btnSubmit/));
    expect(handleOnClose).toHaveBeenCalledTimes(1);
  });
});
