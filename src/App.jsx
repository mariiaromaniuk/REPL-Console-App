import './App.css'
import { createContext, useState, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import Input from './containers/Input';
import Console from './containers/Console.jsx';
import TopBar from './containers/TopBar';
import useInputHistory from './hooks/useInputHistory'; // A custom hook

export const AppContext = createContext({
  mode: 'light',
  onToggleMode: () => { },
});

export default function App() {
  // an array to hold the history of code input and their corresponding output
  const [history, setHistory] = useState([]);
  // To make the application respond to the system's dark mode changes, we can use window.matchMedia function. It checks for the media query that corresponds to the dark mode setting. The mode is initially set based on the current value of the media query when the app is loaded.
  const [mode, setMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light'
  );
  // Unique id that is used for each "session" or "context" of the console. 
  // It's generated using the uuid package, which provides universally unique identifiers, it changes each time the history is cleared
  const [contextId, setContextId] = useState(uuid());

  // add a new filter state and a filtered history state
  const [filter, setFilter] = useState("");
  const filteredHistory = useMemo(() => {
    if (!filter) return history;
    return history.filter(entry => entry.input.includes(filter));
  }, [history, filter]);

  // create a new function to handle filter changes
  const onFilterChange = useCallback(newFilter => {
    setFilter(newFilter);
  }, []);

  const { setCurrentInput, onNextInput, onPreviousInput } = useInputHistory(history);

  // Functions that are created within a component will be recreated every time that component renders. 
  // This can lead to performance issues. You can use the useCallback hook to prevent this.
  const onClear = useCallback(() => {
    setHistory([]);
    setCurrentInput(-1);
    setContextId(uuid());
    setFilter("");
  }, []);

  // Updating history on each user enter
  // Functions that are created within a component will be recreated every time that component renders. 
  // This can lead to performance issues. You can use the useCallback hook to prevent this.
  const addHistory = useCallback((newHistory) => {
    setHistory(existingHistory => [...existingHistory, newHistory]);
    setCurrentInput(-1);
  }, []);

  const onToggleMode = useCallback(() => {
    setMode(mode => mode === 'light' ? 'dark' : 'light');
  }, []);

  return (
    // contextId is being provided through a Context Provider so that it can be accessed easily by any nested component that needs it avoiding prop drilling
   <AppContext.Provider value={{ mode, contextId, onToggleMode }}>
    <TopBar onClear={onClear} onFilterChange={onFilterChange} filter={filter} />
      <div id="contents" className={`${mode === 'light' ? 'light_mode' : 'dark_mode'}`}>
        {/* Displaying the history of code inputs and their corresponding outputs */}
        {filteredHistory.map(entry => (
          <div key={entry.id} className="console_container">
            <Console entry={entry} />
          </div>
        ))}
        <Input
          onEnter={addHistory}
          onNextInput={onNextInput}
          onPreviousInput={onPreviousInput}
        />
      </div>
   </AppContext.Provider>
  )
}

