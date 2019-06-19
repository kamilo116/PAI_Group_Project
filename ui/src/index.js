import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'
// import cartReducer from './components/reducers/cartReducer';
import reducers from './components/reducers';

import { Provider } from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from "redux-thunk";

const store = createStore(reducers, compose(applyMiddleware(thunk)));
//Provider store=... gets the store as a prop.
// Provider wraps up your React application and makes it aware of the entire Redux’s store.
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './components/App';
// import {Basket} from './components/Basket'
// import AddProduct from './components/AddProduct'
// import AddCategory from './components/AddCategory'
// import {Router, Route, browserHistory} from 'react-router';
// import {Provider} from 'react-redux';
// import {createStore, applyMiddleware, compose} from 'redux';
// import cartReducer from './reducers/cartReducer';
// import thunk from 'redux-thunk';
// import reducers from './reducers';
//
// const store = createStore(reducers, compose(applyMiddleware(thunk)));
//
// const Root = () => {
//     return (
//         <div className="container">
//             <Router history={browserHistory}>
//                 <Route path="/" component={App}/>
//                 <Route path="/basket" component={Basket}/>
//                 <Route path="/addProduct" component={AddProduct}/>
//                 <Route path="/addCategory" component={AddCategory}/>
//             </Router>
//         </div>
//     )
// }
//
// ReactDOM.render(
//     <Provider store={store}>
//         <Root/>
//     </Provider>, document.getElementById('root'));
