import {
  render,
  screen,
  waitFor,
  fireEvent,
  RenderResult,
  getByTestId,
  within,
  wait,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import { inputAdornmentClasses, TextField, ThemeProvider } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';
import ModalAddItems from '../../../../components/commons/ui/modal-add-items';
import { getById } from '../../../../utils/custom-testing-library';

// let wrapper: RenderResult<typeof import('@testing-library/dom/types/queries'), HTMLElement>;
const mockStore = configureStore();

let store: Store<any, AnyAction>;
sessionStorage.setItem('user_info', mockUserInfo);
const handleOnClose = jest.fn();
beforeEach(() => {
  store = mockStore(initialState);
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
describe('component modal-add-items', () => {
  // it('find text autocomplete', () => {
  //   expect(screen.getByTestId('testid-selAddItem')).toBeInTheDocument();
  // });
  // it('find  testid-tbxSearch', () => {
  //   expect(screen.getByTestId('testid-tbxSearch')).toBeInTheDocument();
  // });

  // it('find place holder', () => {
  //   expect(screen.getByPlaceholderText('บาร์โค้ด/รายละเอียดสินค้า')).toBeInTheDocument();
  // });

  // it('onselect items', async () => {
  //   const autocomplete = screen.getByTestId(/autocomplete-search-branch-list/);
  //   const input = within(autocomplete).getByRole('textbox') as HTMLInputElement;
  //   autocomplete.focus();

  //   // fireEvent.input(input, { target: { value: '12PLUS' } });
  //   // fireEvent.change(input, { target: { value: '12PLUS' } });

  //   // setTimeout(() => {
  //   // navigate to the first item in the autocomplete box
  //   fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
  //   fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
  //   // select the first item
  //   // fireEvent.keyDown(autocomplete, { key: 'Enter' });
  //   //   setTimeout(() => {
  //   // check the new value of the input field
  //   expect(screen.getByText(/12PLUSบอดี้&แฮร์เพอร์ฟูมลอนดอนแพร์25ml Pack/i)).toBeInTheDocument();
  //   //   }, 5000);
  //   // }, 5000);
  // });

  it('onselect items', async () => {
    let rendered: ReturnType<typeof render>;

    await act(() => {
      rendered = render(
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <ModalAddItems
              open={true}
              onClose={handleOnClose}
              requestBody={{
                skuCodes: undefined,
                skuTypes: undefined,
                isOrderable: undefined,
                isSellable: undefined,
                productTypeCodes: undefined,
                isControlStock: undefined,
              }}
            />
          </ThemeProvider>
        </Provider>
      );
    });

    const autocomplete = await screen.getByPlaceholderText('บาร์โค้ด/รายละเอียดสินค้า');

    fireEvent.mouseDown(autocomplete);
    console.debug('body: ', document.body);
    // const { getByText: getByBodyText } = within(document.body);
    // const option = getByBodyText('BuBuBu');
    // expect(option).toBeInTheDocument();
    // fireEvent.click(option as HTMLElement);

    // expect(autocomplete).toHaveProperty('value', 'BuBuBu');
  });

  //   it('on close modal', () => {
  //     fireEvent.click(screen.getByTestId('testid-btnClose'));
  //     expect(handleOnClose).toHaveBeenCalledTimes(1);
  //   });

  //   it('on add item modal', async () => {
  //     const { container } = await render(
  //       <Provider store={store}>
  //         <ThemeProvider theme={theme}>
  //           <ModalAddItems
  //             open={true}
  //             onClose={handleOnClose}
  //             requestBody={{
  //               skuCodes: undefined,
  //               skuTypes: undefined,
  //               isOrderable: undefined,
  //               isSellable: undefined,
  //               productTypeCodes: undefined,
  //               isControlStock: undefined,
  //             }}
  //           />
  //         </ThemeProvider>
  //       </Provider>
  //     );
  //     setTimeout(() => {
  //       fireEvent.click(screen.getByTestId('testid-btnAdd'));
  //       expect(handleOnClose).toHaveBeenCalledTimes(1);
  //     }, 1000);
  //   });
});
