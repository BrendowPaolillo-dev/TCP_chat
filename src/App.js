import React, { useEffect, useState } from 'react';

import { Row } from 'antd';

import Chat from './components/chat';
import Login from './pages/login';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const App = ({ history }) => {
	return (
		<Router>
            <Switch>
                <Route path="/chat">
                    <Chat history={history} />
                </Route>
                <Route path="/">
                    <Login history={history} />
                </Route>
                <Route path="/login">
                    <Login history={history} />
                </Route>
            </Switch>
        </Router>
	);
}

export default App;
