import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import Storage from '../auxiliary/storage';

import {
    Row,
    Input,
    Button,
} from 'antd';

import { MessageOutlined } from '@ant-design/icons';

import Message from './message';
import MainLayout from './mainLayout';
import ChatHeader from './chatHeader';

import './chat.css';

const Chat = () => {

    const userName = Storage.getUserName();

    const [clientsConnected, setClientsConnected] = useState([]);

    const [ws, setWs] = useState(null);

    const [userMessage, setUserMessage] = useState('');
    const [newMessage, setNewMessage] = useState({});
    const [allMessages, setAllMessages] = useState([]);
    const [destination, setDestination] = useState("Global");

    const join = () => {
        const msg = [1, userName];
        ws.send(btoa(JSON.stringify(msg)));
    }

    const closeConnection = () => {
        const msg = [6, userName];
        ws.send(btoa(JSON.stringify(msg)));
    }

    const sendMessage = () => {
        let msg = [];
        if (destination === 'Global'){
            msg = [2, userName, userMessage];
        } else {
            msg = [4, userName, userMessage, destination];
        }
        ws.send(btoa(JSON.stringify(msg)));
        setUserMessage('');
    }

    const getUserList = () => {
        const msg = [3, userName];
        ws.send(btoa(JSON.stringify(msg)));
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

    const privateMessage = (senderName, text) => (
        <>
            <Row justify="start" style={{ marginTop: 15 }}>
                <span style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: 10, marginLeft: 10 }}>
                    {`Mensagem privada de ${senderName}: `}
                </span>
            </Row>
            <Row justify="start">
                <Message text={text} userName={senderName}/>
            </Row>
        </>
    );

    const displayMessages = ({ code, senderName, text, _,file }) => {
        switch(code){
            case 1:
                if (userName !== senderName) {
                    console.log('before set: ', clientsConnected);
                    return userHasConnected(senderName);
                }
                break;
            case 2:
                return globalMessage(senderName, text);
            case 4:
                return privateMessage(senderName, text);
            case 5:
                break;
            case 6:
                return userHasDisconnected(senderName);
            default:
                break;
        }

    }

    useEffect(() => setAllMessages([...allMessages, newMessage]), [newMessage]);

    const manageMessages = msg => {
        const [code, senderName, data = '', file = ''] = JSON.parse(atob(msg));

        const pushNewMessage = () => setNewMessage({ id: allMessages.length, code, senderName, text: data, file });
        
        switch(code){
            case 1:
                if (userName !== senderName) {
                    setClientsConnected(clientsConnected.concat(senderName));
                } else {
                    setClientsConnected(getUserList());
                }
                pushNewMessage();
                break;
            case 3:
                setClientsConnected(data);
                break;
            case 6:
                setClientsConnected(clientsConnected.filter(c => c !== senderName));
                pushNewMessage();
                break;
            default:
                pushNewMessage();
                break;
        }

    };

    useEffect(() => {
        if (ws) {
            ws.onopen = () => join('user1');
            ws.onmessage = ({ data }) => manageMessages(data);
            return () => closeConnection();
        } else {
            setWs(new WebSocket('ws://localhost:8080', userName));
        }
    }, [ws]);

    return (
        <MainLayout>
            <Row justify="center">
                <div className="chat">
                    <Row justify="space-between" className="chat-header">
                        <ChatHeader
                            userName={userName}
                            clientsConnected={clientsConnected}
                            onChangeDestination={value => {console.log('value changed:', value); setDestination(value);}}
                        />
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