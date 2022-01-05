// componets/Greetings.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { idText } from 'typescript';
import Greeting from '../../../components/greeting/greeting';

// let wrapper:any = render(<UnitTestComponent name="Test Name" />);
let wrapper;
beforeEach(() => {
  wrapper = render(<Greeting userName='Test Test' />);
});

describe('when rendered with a `name` prop', () => {
  it('should paste it into the greetings text', () => {
    expect(screen.getByText(/Test Test/)).toBeInTheDocument();
  });
});
