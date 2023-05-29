import React, { useContext, useState, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
const HeapContext = React.createContext({})

// A console-like UI for the application
export default function Console({ entry }) {
  console.log("Entry", entry) 
  const isError = entry.output.status === "error";
  const result = entry.output.result;

  return (
    // ErrorBoundary is a React component that is used to catch any errors anywhere in its child component tree, logs those errors, and instead of breaking the application, it will render the fallback UI provided in the fallbackRender prop.
    <ErrorBoundary fallbackRender={() =>
      <div className={`${isError ? "error" : ''}`}>
        Could not render
      </div>
    }>
      <div>
        <div className="chevron">{">"}</div>
        <div className="console">{entry.input}</div>
      </div>
      <div className={`${isError ? "error" : ''}`}>
        <div className="chevron">{isError ? "" : "<"}</div>
        <div className="console console_output">
          {isError ? 
          `[${result.name}] ${result.message}` 
            : (
              <HeapContext.Provider value={result}>
                <OutputValue id={0} />
              </HeapContext.Provider>
            )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

const OutputValue = ({ id }) => {
  // HeapContext is used to store and access the output result represented in a heap format.
  // It provides a way to pass the console output result down the component tree without prop drilling at every level. This allows the component to recursively render data structures by referring to other parts of the heap using the IDs.
  const heap = useContext(HeapContext);
  // retrieves the current value from the HeapContext
  const current = heap[id];

  switch (current.type) {
    case "object":
      return (
        <Expander summary={"{}"}>
          {current.value.map(({ key, value }) => 
              <div key={`${key}-div`}>
                <OutputValue id={key} />
                {": "}
                <OutputValue id={value} />
              </div>
            )}
        </Expander>
      )
    case "array":
      return (
        <Expander summary={`(${current.value.length}) []`}>
          {current.value.map((item, index) => 
          <div key={`${index}-div`}>
            {`${index}: `}
            <OutputValue id={item} />
          </div>
          )}
          {`length: ${current.value.length}`}
        </Expander>
      )
    case 'date':
      return (new Date(current.value)).toString();
    case 'function':
      return String(current.value.body);
    case "undefined":
      return <Primitive value={"undefined"} />;
    case "null":
      return <Primitive value={null} />;
    case "nan":
      return <Primitive value={NaN} />;
    case "infinity":
      return <Primitive value={current.value === "+" ? "+Infinity" : "-Infinity"} />;
    case "boolean":
    case "string":
    case "number":
      return <Primitive value={current.value} />
    default:
      throw new Error;
  }
}

function Primitive(props) {
  return (
    <span>
      {JSON.stringify(props.value, null, 2)}
    </span>
  )
}

// Expander takes an object as a parameter that has children and summary properties, which are then destructured.
function Expander({ children, summary }) {
  // isOpen is used to track whether the component's content is visible or not.
  const [isOpen, setOpen] = useState(false);
  // useCallback hook memoizes the onToggle function to improve performance. 
  // onToggle takes an event object and toggles the isOpen state. It is used as an event handler for clicking on the summary element.
  const onToggle = useCallback(event => {
    // The <details> HTML element has a built-in behavior: it automatically toggles between "open" and "closed" states when clicked.
    // We want to control this behavior manually using our own state logic (isOpen state variable), so we need to prevent the default action from happening - stop the browser's default click behavior on the details element, so we can control the open/close state manually with your own isOpen state variable.
    // Without event.preventDefault(), clicking the details element would cause both the browser's default toggling and our setOpen function to fire, which could result in unpredictable behavior.
    event.preventDefault();
    // Prevents the event from bubbling up the DOM event chain, which stops any parent handlers from being notified of the event
    event.stopPropagation();
    setOpen(o => !o);
  }, [setOpen])

  return (
    // a built-in HTML element that creates a widget for interactive disclosure of information.
    <details open={isOpen} onClick={onToggle}>
      <summary>{summary}</summary>
      <div style={{ paddingLeft: 12, boxSizing: 'border-box'}}>
        {isOpen ? children : null}
      </div>
    </details>
  )
}