import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';
import ModalCloseSale from 'components/accounting/close-saleshift/modal-close-sale';
import { ThemeProvider } from '@mui/material';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
const handleOnClose = jest.fn();
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
  wrapper = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalCloseSale open={true} onClose={handleOnClose} noOfShiftKey={''} docNo={''} />
      </ThemeProvider>
    </Provider>
  );
});

describe('component AlertError', () => {
  // console.debug('debug:', inputField);
  it('find button close', () => {
    expect(screen.getByTestId(/btnClose/)).toBeInTheDocument();
    let btnClose = screen.getByTestId(/btnClose/);
    expect(btnClose.textContent).toEqual('ปิด');
  });

  it('find alert text error', () => {
    expect(screen.getByTestId(/txtContent/)).toBeInTheDocument();
    let txtContent = screen.getByTestId(/txtContent/);
    expect(txtContent.textContent).toEqual('กรุณาตรวจสอบข้อมูล');
  });

  it('on click btn close', () => {
    fireEvent.click(screen.getByTestId(/btnClose/));
    expect(handleOnClose).toHaveBeenCalledTimes(1);
  });
});
