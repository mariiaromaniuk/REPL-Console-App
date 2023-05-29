import { render, fireEvent } from '@testing-library/react';
import { AppContext } from '../../App';
import Input from '../Input';

test('renders without crashing', () => {
  const addHistory = jest.fn();
  const onNextInput = jest.fn();
  const onPreviousInput = jest.fn();
  const mockContext = { contextId: "1234", mode: "light" };

  render(
    <AppContext.Provider value={mockContext}>
      <Input
        onEnter={addHistory}
        onNextInput={onNextInput}
        onPreviousInput={onPreviousInput}
      />
    </AppContext.Provider>
  );
});

test('updates state when typing', () => {
  const addHistory = jest.fn();
  const onNextInput = jest.fn();
  const onPreviousInput = jest.fn();
  const mockContext = { contextId: "1234", mode: "light" };

  const { getByRole } = render(
    <AppContext.Provider value={mockContext}>
      <Input
        onEnter={addHistory}
        onNextInput={onNextInput}
        onPreviousInput={onPreviousInput}
      />
    </AppContext.Provider>
  );

  fireEvent.change(getByRole('textbox'), { target: { value: 'Hello, World!' } });
  expect(getByRole('textbox').value).toBe('Hello, World!');
});
