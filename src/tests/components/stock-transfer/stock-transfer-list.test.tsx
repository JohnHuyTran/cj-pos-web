import { render, screen, fireEvent, RenderResult, within, getByTestId } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { mockUserInfo, mockUserInfoGroupDC } from '../../mockData';
import theme from '../../../styles/theme';
import {
  mockDataBtDetailDataEmpty,
  mockDataBtDetailDraft,
  mockDataBtSearchDataEmpty,
} from '../../mockdata-store/mock-store-stock-transfer-bt';
import StockTransferList from '../../../components/stock-transfer/stock-transfer-list';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store: Store<any, AnyAction>;
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(mockDataBtDetailDraft);
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

describe('component stock-transfer-bt search', () => {
  it('find all items', async () => {
    const renderer = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StockTransferList />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).toContainHTML('BT22060101-000062');
  });
});
