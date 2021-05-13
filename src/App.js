import React, { useEffect, useState } from 'react';

import { Row } from 'antd';

import Chat from './components/chat';
import MainLayout from './components/mainLayout';

const App = () => {

	const [ws] = useState(new WebSocket('ws://localhost:8080'));

    const join = userName => {
        const msg = [1, 'userName'];
        ws.send(JSON.stringify(msg));
    }

    useEffect(() => {
        ws.onopen = () => join('user1');
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
