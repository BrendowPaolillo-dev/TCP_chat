import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.send('Olá para todos!');
      console.log('onopen websocket');
    }
    ws.onmessage = msg => console.log('mensagem recebida: ', msg)
  }, []);

  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
