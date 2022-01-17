import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StockTransfer from '../../../pages/stock-transfer';

// let wrapper;
// beforeEach(() => {
//   wrapper = render(<StockTransfer />);
// });

// describe('when rendered with a `name` prop', () => {
// it('should paste it into the greetings text', () => {
//   expect(screen.getByText(/Hello Test Name!/)).toBeInTheDocument();
// });
// it('should render the sending waves button', () => {
//   expect(screen.getByRole('button')).toBeInTheDocument();
// });
// it('should call the `testXX` callback', () => {
//   userEvent.click(screen.getByRole('button'));
//   expect(screen.getByText(/success/)).toBeInTheDocument();
// });
// });

test('reader learn link', () => {
  const { getByText } = render(<StockTransfer />);
  const linkElement = getByText('/stock-transfer');
  expect(linkElement).toBeInTheDocument();
});
