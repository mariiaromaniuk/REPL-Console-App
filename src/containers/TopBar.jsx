import { useContext } from 'react';
import { AppContext } from '../App';

export default function TopBar({ onClear, onFilterChange, filter }) {
  const appContext = useContext(AppContext);

  // create a new function to handle filter input changes
  const handleFilterChange = event => {
    onFilterChange(event.target.value);
  };

  return (
    <div
      id="topbar_container"
      className={`${appContext.mode === 'light' ? 'light_mode' : 'dark_mode'}`}
    >
      <button className="topbar_button" onClick={onClear}>Clear console</button>
      <input
        className="filter_input"
        // className={`filter_input ${appContext.mode === 'light' ? 'light_mode' : 'dark_mode'}`} 
        value={filter} 
        onChange={handleFilterChange} 
        placeholder="Filter history"
      />
      <label className="switch">
        <input 
          type="checkbox" 
          checked={appContext.mode === 'light' ? false : true} 
          onChange={appContext.onToggleMode} 
        />
        <span className="slider round"></span>
      </label>
    </div>
  )
}