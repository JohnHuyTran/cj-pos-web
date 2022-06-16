import { render, screen, fireEvent, RenderResult, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo, mockUserInfoGroupDC } from '../../../mockData';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import StockTransferBT from '../../../../components/stock-transfer/branch-transfer/stock-transfer-bt';
import {
  mockDataBtDetailDraft,
  mockDataBtDetailWaitForPickup,
} from '../../../mockdata-store/mock-store-stock-transfer-bt';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store: Store<any, AnyAction>;
const handleOnClose = jest.fn();
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {});
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

describe('component stock-transfer-bt', () => {
  it('find all button is status draft', () => {
    store = mockStore(mockDataBtDetailDraft);
    const wrapper = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StockTransferBT isOpen={true} onClickClose={handleOnClose} />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('testid-btnSave')).toBeInTheDocument();
    expect(screen.getByTestId('testid-btnSendToDC')).toBeInTheDocument();
    expect(screen.getByTestId('testid-btnAddItem')).toBeInTheDocument();
  });

  it('find all button is status wait for picker and group branch', () => {
    store = mockStore(mockDataBtDetailWaitForPickup);
    const wrapper = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StockTransferBT isOpen={true} onClickClose={handleOnClose} />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByTestId('testid-btnApprove')).toBeInTheDocument();
    expect(screen.queryByTestId('testid-btnSave')).toBeNull();
    expect(screen.queryByTestId('testid-btnAddItem')).toBeNull();
  });

  it('find all button is status wait for picker and group dc', () => {
    sessionStorage.setItem('user_info', mockUserInfoGroupDC);
    store = mockStore(mockDataBtDetailWaitForPickup);
    const wrapper = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StockTransferBT isOpen={true} onClickClose={handleOnClose} />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.queryByTestId('testid-btnApprove')).toBeNull();
    expect(screen.queryByTestId('testid-btnSave')).toBeNull();
    expect(screen.queryByTestId('testid-btnAddItem')).toBeNull();
  });
});
