import React, { useEffect } from 'react';

import { Row } from 'antd';

import Chat from './components/chat';
import MainLayout from './components/mainLayout';

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
    <MainLayout>
        <Row justify="center">
          	<Chat />
        </Row>
    </MainLayout>
  );
}

export default App;
