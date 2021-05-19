import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Storage from '../auxiliary/storage';

import {
    Row,
    Input,
    Button,
} from 'antd';

import { MenuOutlined, MessageOutlined } from '@ant-design/icons';

import Message from './message';
import MainLayout from './mainLayout';

import './chat.css';

const Chat = () => {

    const userName = Storage.getUserName();

    const [ws, setWs] = useState(null);

    const [userMessage, setUserMessage] = useState('');
    const [newMessage, setNewMessage] = useState({});
    const [allMessages, setAllMessages] = useState([]);
    const [clientsConnected, setClientsConnected]  = useState([]);
    
    const join = () => {
        const msg = [1, userName];
        ws.send(btoa(JSON.stringify(msg)));
    }

    const closeConnection = () => {
        const msg = [5, userName];
        ws.send(btoa(JSON.stringify(msg)));
    }

    const sendMessage = () => {
        const msg = [2, userName, userMessage];
        ws.send(btoa(JSON.stringify(msg)));
        setUserMessage('');
    }


    const userHasConnected = newUserName => (
        <div className="new-user-connected">
            {`Usuário ${newUserName} conectado`}
        </div>
    );

    const userHasDisconnected = user => (
        <div className="new-user-connected">
            {`Usuário ${user} Desconectado`}
        </div>
    );

    const myMessage = text => (
        <Row justify="end">
            <Message messageColor="blue" text={text} />
        </Row>
    );

    const otherMessage = (text, senderName) => (
        <Row justify="start">
            <Message text={text} userName={senderName}/>
        </Row>
    );
    
    const globalMessage = (senderName, text) => {
        if (senderName === userName) return myMessage(text);

        return otherMessage(text, senderName);
    }

    const displayMessages = ({ code, senderName, text, file }) => {

        switch(code){
            case 1:
                if (userName !== senderName) {
                    setClientsConnected([...clientsConnected, senderName]);
                    return userHasConnected(senderName);
                }
                break;
            case 2:
                return globalMessage(senderName, text);
            case 3:
                break;
            case 4:
                break;
            case 5:
                // console.log(888888, clientsConnected);
                // console.log(99999, clientsConnected.filter(c => c !== senderName));
                // setClientsConnected(clientsConnected.filter(c => c !== senderName));
                return userHasDisconnected(senderName);
            default:
                break;
        }

    }

    useEffect(() => setAllMessages([...allMessages, newMessage]), [newMessage]);

    const updateMessages = useCallback(data => {
        const [code, senderName, text = '', file = ''] = JSON.parse(atob(data));
        setNewMessage({ id: allMessages.length, code, senderName, text, file });
    }, [allMessages]);

    useEffect(() => {
        if (ws) {
            ws.onopen = () => join('user1');
            ws.onmessage = ({ data }) => updateMessages(data);
        }
    }, [ws]);

    useEffect(() => {
        setWs(new WebSocket('ws://localhost:8080', userName));
        return () => {
            if(ws) return closeConnection();
        };
    }, []);

    return (
        <MainLayout>
            <Row justify="center">
                <div className="chat">
                    <Row justify="space-between" className="chat-header">
                        {userName}
                        <MenuOutlined className="menu-icon" />
                    </Row>
                    <div className="chat-body">
                        {allMessages.map(message => displayMessages(message))}
                    </div>
                    <div className="chat-footer">
                        <Input
                            value={userMessage}
                            className="footer-input"
                            onPressEnter={sendMessage}
                            placeholder="Insira a mensagem"
                            onChange={e => setUserMessage(e.target.value)}
                        />
                        <Button
                            type="primary"
                            onClick={sendMessage}
                        >
                            <span className="link-enviar">
                                Enviar
                                <MessageOutlined style={{ marginLeft: 5 }}/>
                            </span>
                        </Button>
                    </div>
                </div>
            </Row>
        </MainLayout>
    );
};

export default withRouter(Chat);