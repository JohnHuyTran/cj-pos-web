// componets/Greetings.test.tsx

import { render, screen } from '@testing-library/react';
import DCCheckOrderSearch from '../../../components/dc-check-orders/dc-check-order';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../mockStore';
import { ThemeProvider } from '@mui/material';
import theme from '../../../styles/theme';
import { mockUserInfo } from '../../mockData';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
  wrapper = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DCCheckOrderSearch />
      </ThemeProvider>
    </Provider>
  );
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
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

describe('show screen', () => {
  it('find wording text', () => {
    expect(screen.getByText(/ค้นหาเอกสาร/)).toBeInTheDocument();
  });
});
