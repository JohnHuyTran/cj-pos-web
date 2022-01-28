import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import StockTransfer from '../../../pages/stock-transfer';
// import CheckOrderSearch from '../../../components/check-orders/check-order';
import AlertError from '../../../components/commons/ui/alert-error';

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
  const { getByText } = render(<AlertError open={false} onClose={function (): void {}} textError={''} />);
  const linkElement = getByText('/stock-transfer');
  expect(linkElement).toBeInTheDocument();
});
