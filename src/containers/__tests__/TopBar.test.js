import { render, fireEvent } from '@testing-library/react';
import TopBar from '../TopBar';
import { AppContext } from '../../App';

test('should change the input filter', () => {
  const mockOnClear = jest.fn();
  const mockOnFilterChange = jest.fn();

  const { getByRole } = render(
    <AppContext.Provider value={{ mode: 'light', onToggleMode: () => {} }}>
      <TopBar onClear={mockOnClear} onFilterChange={mockOnFilterChange} filter="" />
    </AppContext.Provider>,
  );

  const textbox = getByRole('textbox');
  fireEvent.change(textbox, { target: { value: 'Error' } });
  expect(mockOnFilterChange).toHaveBeenCalledWith('Error');
});