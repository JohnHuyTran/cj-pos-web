// componets/Greetings.test.tsx

import { fireEvent, getByText, render, screen, waitFor, within } from '@testing-library/react';
import DCCheckOrderSearch from '../../../components/dc-check-orders/dc-check-order';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../mockStore';
import { ThemeProvider } from '@mui/material';
import theme from '../../../styles/theme';
import { mockUserInfo } from '../../mockData';
import { getByClass, getById } from '../../../utils/custom-testing-library';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let wrapper;
// const mockStore = configureStore();
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
// const mockDispatch = jest.fn();
// jest.mock('react-redux', () => ({
//   useSelector: jest.fn(),
//   useDispatch: () => mockDispatch,
// }));
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
  it('to be click btn search find show datagrid have sd no-> SD22060101-000004 ', async () => {
    expect(getById('btnSearch')).toBeInTheDocument();
    expect(screen.getByText('ค้นหา')).toBeInTheDocument();
    await waitFor(() => fireEvent.click(screen.getByText('ค้นหา')));
    setTimeout(() => {
      expect(screen.getByText('SD22060101-000004')).toBeInTheDocument();
    }, 5000);
  });
  it('is click btn clear defaul value is clear', async () => {
    expect(screen.getByText(/เคลียร์/)).toBeInTheDocument();
    await waitFor(() => fireEvent.click(screen.getByText(/เคลียร์/)));
    setTimeout(() => {
      expect(screen.getByText(/กรุณาเลือกวันที่/)).toBeInTheDocument();
    }, 5000);

    // await waitFor(() => fireEvent.click(screen.getByText('ค้นหา')));
    setTimeout(() => {
      expect(screen.getByTestId(/txtContent/)).toBeInTheDocument();
      let txtContent = screen.getByTestId(/txtContent/);
      expect(txtContent.textContent).toEqual('กรุณากรอกวันที่รับสินค้า');
    }, 5000);
  });
  it('find LD20220601001001  is render in datagrid ', () => {});
});

// describe('component check stock', () => {
//   it('find button close', () => {
//     expect(screen.getByText('ปิด')).toBeInTheDocument();
//     fireEvent.click(screen.getByText('ปิด'));
//     expect(onClose).toHaveBeenCalledTimes(1);
//   });

//   it('find data stock', () => {
//     expect(screen.getByRole('grid')).toBeInTheDocument();
//     expect(screen.getAllByRole('row')[1]).toContainHTML('18857122754576');
//   });
// });
