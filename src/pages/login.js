import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import {
    Row,
    Card,
    Input,
    Button,
} from 'antd';

import Storage from '../storage';

const Login = ({ history }) => {
    const [userName, setUserName] = useState('');

    const onChange = e => setUserName(e.target.value);

    const onFinish = () => {
        Storage.setUserName(userName);
        history.push('./chat');
    };

	return (

        <Row
            align="middle"
            justify="center"
            style={{ marginTop: 200 }}
        >
            <Card
                title="Login"
                style={{
                    width: 400,
                    borderColor: 'rgba(0, 0, 0, 0.3)'
                }}
            >
                <Input
                    onChange={onChange}
                    placeholder="Username"
                    style={{ marginTop: 5 }}
                />
                <span style={{ 
                    fontSize: 12,
                    color: 'rgba(0, 0, 0, 0.4)'
                }}>
                    Insira seu username para entrar no chat global
                </span>

                <Row justify="end" style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        onClick={onFinish}
                    >
                        Entrar
                    </Button>
                </Row>
            </Card>
        </Row>
	);
}

export default withRouter(Login);
