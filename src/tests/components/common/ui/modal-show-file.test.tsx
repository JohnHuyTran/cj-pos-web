import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import { ThemeProvider, Typography } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';

import ModalShowPDF from '../../../../components/commons/ui/modal-show-file';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
});
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
describe('component modal show file', () => {
  it('modal show document pdf with path file', async () => {
    const handleOnClick = jest.fn();
    const handleOnPrint = jest.fn();
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ModalShowPDF
            open={true}
            url={'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
            sdImageFile={''}
            statusFile={1}
            fileName={'BT22060101-000014-COMPLETED.pdf'}
            btnPrintName={'พิมพ์เอกสาร'}
            onClose={handleOnClick}
          />
        </ThemeProvider>
      </Provider>
    );
    // await new Promise((r) => setTimeout(r, 5000));
    expect(screen.getByTestId('testid-pdfWrapper-document')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('testid-btnPrint'));
  });

  it('modal show document pdf with data', async () => {
    const handleOnClick = jest.fn();
    const handleOnPrint = jest.fn();
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ModalShowPDF
            open={true}
            url={'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
            sdImageFile={''}
            statusFile={2}
            fileName={'BT22060101-000014-COMPLETED.pdf'}
            btnPrintName={'พิมพ์เอกสาร'}
            onClose={handleOnClick}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByTestId('testid-pdfWrapper-document')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('close'));
    expect(handleOnClick).toHaveBeenCalledTimes(1);
  });

  it('can not to show file', async () => {
    const handleOnClick = jest.fn();
    const handleOnPrint = jest.fn();
    const container = await render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ModalShowPDF
            open={true}
            url={
              'https://posback-dev.obs.ap-southeast-2.myhuaweicloud.com/0101/BT22040101-000035-01.pdf?AWSAccessKeyId=O8YIMUIBJFUOILXDUNAM&Expires=1651803232&Signature=DOs%2BDXRjOvlAIy6VJlVi96%2FWlD8%3D'
            }
            sdImageFile={''}
            statusFile={2}
            fileName={'BT22060101-000014-COMPLETED.pdf'}
            btnPrintName={'พิมพ์เอกสาร'}
            onClose={handleOnClick}
          />
        </ThemeProvider>
      </Provider>
    );
    setTimeout(() => {
      expect(screen.getByText('Failed to load PDF')).toBeInTheDocument();
    }, 5000);
  });
});
