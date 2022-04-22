import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Store, AnyAction } from '@reduxjs/toolkit';
import { initialState } from '../../../mockStore';
import { ThemeProvider } from '@mui/material';
import theme from '../../../../styles/theme';
import { mockUserInfo } from '../../../mockData';

import TextBoxComment from '../../../../components/commons/ui/textbox-comment';

let wrapper;
const mockStore = configureStore();
let store: Store<any, AnyAction>;
sessionStorage.setItem('user_info', mockUserInfo);
beforeEach(() => {
  store = mockStore(initialState);
  wrapper = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <TextBoxComment
          fieldName={'comment label'}
          defaultValue={'default value to unit test'}
          maxLength={100}
          onChangeComment={function (value: string): void {
            throw new Error('Function not implemented.');
          }}
          isDisable={false}
        />
      </ThemeProvider>
    </Provider>
  );
});

describe('component text-comment', () => {
  // console.debug('debug:', inputField);
  it('find text box', () => {
    expect(screen.getByTestId(/form-field-tbxComment/)).toBeInTheDocument();
  });
  it('find label subject', () => {
    expect(screen.getByText(/comment label/)).toBeInTheDocument();
  });
  it('should show input with initial value set ', () => {
    // const inputField = screen.getByTestId(`form-field-firstname`);
    // expect(inputField).toHaveDisplayValue(/default value to unit test/);
    expect(screen.getByRole('textarea', { name: 'tbxComment' })).toHaveValue('default value to unit test');
    // expect(screen.getByTestId(/form-field-tbxComment/)).toHaveDisplayValue(/default value to unit test/);
  });
});
