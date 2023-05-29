import '../App.css'
import { useContext, useState, useRef, useLayoutEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { AppContext } from '../App';
// import CodeMirrorInput from './CodeMirrorInput';

const FETCH_URI = "https://flatval.repl.co/";

// This component handles the user's code input. It maintains its own state for the current input and uses a useRef to get a reference to the textarea element for input.
// It's expected to return a JSON response. JSON cannot represent cyclic data structures - if the server attempted to stringify a cyclic structure to JSON, it would throw an error. Therefore, the server must be handling any potential cycles in the data before it's sent to this application.

export default function Input({ onEnter: addHistory, onNextInput, onPreviousInput }) {
  const [input, setInput] = useState('');
  // Reference to the textarea DOM element. useRef hook returns a mutable ref object where .current property is initialized to the passed argument
  // This reference is then used in the click event handler of the div containing the textarea: <div onClick={() => inputRef.current?.focus()}>
  // When the div is clicked, the event handler calls the focus method on the textarea DOM element by accessing it via inputRef.current. This causes the textarea to be focused programmatically, meaning the cursor will go to the textarea ready for user input.
  const inputRef = useRef(null);
  const { contextId, mode } = useContext(AppContext);

  // When the user submits an input, it makes a POST request with the contextId and the user's code.
  const onEnter = async () => {
    const output = await fetch(FETCH_URI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contextId, "code": input })
    })
    .then(async (response) => {
      return {
        status: "success",
        // this line is reading the JSON response from the fetch call, and then taking the result property from that JSON.
        result: await response.json().then((json) => json.result)
      }
    })
    .catch((error) => {
      return {
        status: "error",
        result: { 
          // from 'error' data type provided
          name: error.name, 
          message: error.message 
        }
      }
    })
    // The response from this request is passed to the addHistory function, which is provided as a prop from the App component. 
    // This function updates the history state in the App component.
    console.log("Input: ", input);
    console.log("Output: ", output);
    addHistory({ id: uuid(), input, output });
    setInput('');
  }

  // Whenever the user types into the text box, handleChange is called, updating the input state with the current value of the text box
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  // When the user presses a key while the text box is focused, handleKeyDown is called.
  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      onEnter();
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      setInput(onPreviousInput());
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      setInput(onNextInput());
    }
  }

  // Adjust height of input box dynamically based on input.
  // useLayoutEffect hook is similar to useEffect, but it will be run synchronously after the DOM updates, but before the browser repaints. In this case, it depends on inputRef and input.
  useLayoutEffect(() => {
    if (inputRef.current) {
      // Resetting the textarea's height to '0px' before measuring the scrollHeight ensures that we're not including any previously set height in calculation.
      // The scrollHeight property gives the height of the content of an element, including the content that is not currently visible due to overflow. By setting the textarea's height to '0px', we're asking "how tall is the content of this textarea if I don't artificially limit its height?" This gives us the height that the textarea needs to be to accommodate all of its content without needing a scrollbar.
      inputRef.current.style.height = "0px";
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight  + "px";
    }
  }, [inputRef, input]);

  return (
    <>
      <div id="input_container" onClick={() => inputRef.current?.focus()}>
        <div id="input_chevron" className="chevron">{">"}</div>
        <textarea
          autoFocus
          ref={inputRef}
          id="input_box"
          className={`${mode === 'light' ? 'light_mode' : 'dark_mode'}`}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1} //specifies the visible number of lines in a text area
        />
        {/* <CodeMirrorInput
          autoFocus
          id="input_box"
          value={input}
          onChange={setInput}
          onEnter={onEnter}
          onNextInput={onNextInput}
          onPreviousInput={onPreviousInput}
        /> */}
      </div>
    </>
  );
}