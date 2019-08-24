import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'
import reducers from './components/reducers';

import { Provider } from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from "redux-thunk";

const store = createStore(reducers, compose(applyMiddleware(thunk)));
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

