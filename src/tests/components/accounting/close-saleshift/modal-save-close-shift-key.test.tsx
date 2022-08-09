import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';

import { ThemeProvider } from '@mui/material';
import ModalSaveCloseShiftKey from '../../../../components/accounting/close-saleshift/modal-save-close-shift-key';
import { getById } from 'utils/custom-testing-library';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
const handleOnClose = jest.fn();
const noOfShiftKey = '8';
sessionStorage.setItem('user_info', mockUserInfo);
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));
beforeEach(() => {
  store = mockStore(initialState);
  wrapper = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalSaveCloseShiftKey open={true} payload={undefined} onClose={handleOnClose} />
      </ThemeProvider>
    </Provider>
  );
});

describe('component modal close sale', () => {
  // console.debug('debug:', inputField);
  it('find button ตกลง', () => {
    expect(getById('btnSave')).toBeInTheDocument();
  });

  it('find text', () => {
    expect(screen.getByText('กรุณาสแกน Barcode เพื่อเพิ่มรหัสปิดรอบ')).toBeInTheDocument();
    // expect(screen.getByText(`จำนวนรหัสปิดรอบ: 8`)).toBeInTheDocument();
  });

  //   it('on click btn บันทึก', () => {
  //     fireEvent.click(getById('btnSave')!);
  //     expect(handleOnClose).toHaveBeenCalledTimes(1);
  //   });
});
