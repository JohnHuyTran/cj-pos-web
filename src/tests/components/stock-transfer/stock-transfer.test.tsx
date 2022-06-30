import { render, screen, fireEvent, RenderResult, within, getByTestId } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SupplierCheckOrderSearch from '../../../components/stock-transfer/stock-transfer';
import { mockDataStockMovement } from '../../mockdata-store/mock-store-stock';
import { mockUserInfo } from '../../mockData';
import theme from '../../../styles/theme';
let wrapper: RenderResult<typeof import('@testing-library/dom/types/queries'), HTMLElement>;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store: Store<any, AnyAction>;
const handleOnSelectItem = jest.fn();
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(mockDataStockMovement);
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
  it('find all items', () => {
    const renderer: any = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SupplierCheckOrderSearch />
        </ThemeProvider>
      </Provider>
    );
    expect(renderer.getByTestId('testid-txtDocNo')).toBeInTheDocument();
    expect(renderer.getByTestId('testid-btnClear')).toBeInTheDocument();
    expect(renderer.getByTestId('testid-btnSearch')).toBeInTheDocument();
  });

  it('onclice btn search -> show loading', async () => {
    const renderer: any = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SupplierCheckOrderSearch />
        </ThemeProvider>
      </Provider>
    );
    await fireEvent.click(renderer.getByTestId('testid-btnSearch'));
    expect(renderer.getByText('กรุณารอสักครู่')).toBeInTheDocument();
  });

  it('onclice btn clear -> date from,to is กรุณาเลือกวันที่ and click search show popup error กรุณาระบุวันที่โอน ', async () => {
    const renderer: any = render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SupplierCheckOrderSearch />
        </ThemeProvider>
      </Provider>
    );
    await fireEvent.click(renderer.getByTestId('testid-btnClear'));
    // expect(renderer.getByText('กรุณารอสักครู่')).toBeInTheDocument();
    expect(renderer.queryAllByPlaceholderText('กรุณาเลือกวันที่')).toHaveLength(2);

    await fireEvent.click(renderer.getByTestId('testid-btnSearch'));
    expect(renderer.getByText('กรุณาระบุวันที่โอน')).toBeInTheDocument();

    await fireEvent.click(renderer.getByTestId('btnClose'));
    expect(renderer.queryByText('กรุณาระบุวันที่โอน')).toBeNull();
  });
});
