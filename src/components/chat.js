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
    const [fileUploaded, setFileUploaded] = useState('');

    const join = () => {
        const msg = [1, userName];
        ws.send(btoa(JSON.stringify(msg)));
    }

    const closeConnection = () => {
        const msg = [7, userName];
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

    const sendFile = () => {
        let msg = [];
        if (destination === 'Global'){
            msg = [5, userName, '', '', fileUploaded];
        } else {
            msg = [6, userName, '', destination, fileUploaded];
        }

        msg[4].source = JSON.stringify(Array.from(new Uint8Array(msg[4].source)));

        ws.send(btoa(JSON.stringify(msg)));
    };

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

    const privateMessage = (senderName, text) => {
        if (senderName !== userName) {
            return (
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
        } else return myMessage(text);
        
    };

    const fileToDownload = (code, senderName, file, name, whoSend) => {
        const isFromMe = whoSend === userName
        const direction = isFromMe ? 'end' : 'start';

        return (
            <Row justify={direction}>
                <div>
                    {
                        !isFromMe && code !== 6 && (
                            <span style={{ fontSize: 12 }}>
                                {senderName ?? ''}
                            </span>
                        )
                    }
                    {
                        code === 6 && <span style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: 10, marginLeft: 10 }}>
                            {`Mensagem privada de ${senderName}: `}
                        </span>
                    }
                    <br />
                    <div
                        style={{
                            padding: 10,
                            color: 'rgba(255, 255, 255, 1)',
                            fontWeight: 700,
                            borderRadius: 10,
                            marginBottom: 10,
                            maxWidth: 'fit-content',
                            backgroundColor: 'blue',
                        }}
                        >
                        <a href={file} download={name}>
                            {`Download ${name}`}
                        </a>
                    </div>
                </div>
            </Row>
        )
    };

    const manageDownloadFile = (code, senderName, { name, type, source }) => {
        const dataSource = new Uint8Array(JSON.parse(source)).buffer
        const blob = new Blob([dataSource], { type });
        const file = new File([blob], name, { type });

        console.log('source: ', dataSource);
        console.log('manageDownload: ', file);

        if (senderName === userName) {
            return fileToDownload(code, senderName, file, name, userName);
        } else {
            return fileToDownload(code, senderName, file, name, senderName);
        }

    };

    const displayMessages = ({ code, senderName, text, _,file }) => {
        switch(code){
            case 1:
                if (userName !== senderName) {
                    return userHasConnected(senderName);
                }
                break;
            case 2:
                return globalMessage(senderName, text);
            case 4:
                return privateMessage(senderName, text);
            case 5:
                return manageDownloadFile(5, senderName, file);
            case 6:
                return manageDownloadFile(6, senderName, file);
            case 7:
                return userHasDisconnected(senderName);
            default:
                break;
        }

    }

    useEffect(() => {
        if (fileUploaded) {
            sendFile();
        }
    }, [fileUploaded]);

    const onUpload = ({ file: { name, type, originFileObj } }) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(originFileObj)
        reader.onload = () => setFileUploaded({ name, type, source: reader.result });
        // reader.addEventListener('error', () => { setLoading(false); });
    };

    useEffect(() => setAllMessages([...allMessages, newMessage]), [newMessage]);

    const manageMessages = async msg => {
        const [code, senderName, data, _, file] = JSON.parse(atob(msg));

        const pushNewMessage = () => setNewMessage({ id: allMessages.length, code, senderName, text: data, file });
        
        switch(code){
            case 1:
                setClientsConnected(getUserList());
                pushNewMessage();
                break;
            case 3:
                setClientsConnected(data);
                break;
            case 7:
                await setClientsConnected(clientsConnected.filter(c => c !== senderName));
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
                            onUpload={onUpload}
                            clientsConnected={clientsConnected}
                            onChangeDestination={value => setDestination(value)}
                        />
                    </Row>
                    <div className="chat-body">
                        {allMessages.map(message => displayMessages(message))}
                    </div>
                    <Row justify="space-between" className="chat-footer">
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
                    </Row>
                </div>
            </Row>
        </MainLayout>
    );
};

export default withRouter(Chat);