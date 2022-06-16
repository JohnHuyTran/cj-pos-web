import { render, screen, fireEvent, RenderResult, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';
import StockMovementSearch from '../../../../components/stock/stock-movement/stock-movement-search';
import { mockDataStockMovement } from '../../../mockdata-store/mock-store-stock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import StockTransferBT from '../../../../components/stock-transfer/branch-transfer/stock-transfer-bt';
let wrapper: RenderResult<typeof import('@testing-library/dom/types/queries'), HTMLElement>;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store: Store<any, AnyAction>;
const handleOnClose = jest.fn();
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(mockDataStockMovement);
  wrapper = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StockTransferBT isOpen={true} onClickClose={handleOnClose} />
      </ThemeProvider>
    </Provider>
  );
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

describe('component stock-transfer-bt', () => {
  it('find all items', () => {
    expect(screen.getByTestId('testid-btnClear')).toBeInTheDocument();
    expect(screen.getByTestId('testid-btnSearch')).toBeInTheDocument();
  });
});
