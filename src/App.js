import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

function App() {

  // Receive capture boundaries from main process
  window.ipcRender.receive('capture-boundaries', (data) => {
    console.log("boundaries: ", data);
  })

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <img width="100%" alt="Captured Image" src="" id="capture-image" />
      <p id="test">test</p>
    </div>
  );
}

export default App;
