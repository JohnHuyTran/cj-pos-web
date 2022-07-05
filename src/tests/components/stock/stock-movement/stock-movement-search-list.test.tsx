import { render, screen, fireEvent, RenderResult, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';
import { mockDataStockMovement, mockDataStockMovementMoreThen10 } from '../../../mockdata-store/mock-store-stock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import StockMovementSearchList from '../../../../components/stock/stock-movement/stock-movement-search-list';
import { act } from 'react-dom/test-utils';
let wrapper: RenderResult<typeof import('@testing-library/dom/types/queries'), HTMLElement>;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store: Store<any, AnyAction>;
const handleOnSelectItem = jest.fn();
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

describe('component stock-movement-search-list', () => {
  it('find item in data grid have doc no : BT22060101-000014', () => {
    store = mockStore(mockDataStockMovement);
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StockMovementSearchList />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).toContainHTML('BT22060101-000014');
  });

  it('show item > 10', () => {
    store = mockStore(mockDataStockMovement);
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StockMovementSearchList />
        </ThemeProvider>
      </Provider>
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('row')[1]).toContainHTML('BT22060101-000014');
  });

  it('show transaction detail', async () => {
    store = mockStore(mockDataStockMovementMoreThen10);
    const container = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StockMovementSearchList />
        </ThemeProvider>
      </Provider>
    );

    const row = container.getByText('BT22060101-000014');
    row.focus();
    act(() => {
      fireEvent.keyDown(row, { key: 'Enter' });
      fireEvent.click(row);
    });
    await new Promise((r) => setTimeout(r, 1000));
    expect(screen.getByText('ตรวจสอบรายการใบโอน')).toBeInTheDocument();

    // const row2 = container.getByText('LD20220530000003');
    // row2.focus();
    // act(() => {
    //   fireEvent.keyDown(row2, { key: 'Enter' });
    //   fireEvent.click(row2);
    // });
  });
});
