import { useState } from 'react';

export default function useInputHistory(history) {
  // A pointer to the current position in the history array, used when navigating through previous inputs
  const [currentInput, setCurrentInput] = useState(-1);

  // onNextInput and onPreviousInput: used to navigate up and down through the history of inputs
  const onNextInput = () => {
    // User has reached the end of the history
    if (currentInput <= 0) {
      setCurrentInput(-1);
      return '';
    }
    const newCurrentInput = currentInput - 1;
    setCurrentInput(newCurrentInput);
    // Returns the value at the new position from the history array. 
    // We're accessing from the end of the array, so a lower index means a more recent input.
    return history[history.length - 1 - newCurrentInput].input;
  }

  const onPreviousInput = () => {
    if (history.length === 0) {
      return '';
    }
    // Increments the current index but ensures that it doesn't exceed the last index of the history array
    const newCurrentInput = Math.min(history.length - 1, currentInput + 1);
    setCurrentInput(newCurrentInput);
    return history[history.length - 1 - newCurrentInput].input;
  }

  return {
    setCurrentInput,
    onNextInput,
    onPreviousInput
  };
}