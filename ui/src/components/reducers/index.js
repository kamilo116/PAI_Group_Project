import {combineReducers} from 'redux';

import cartReducer from "../reducers/cartReducer";

const rootReducer = combineReducers({cartReducer});

export default rootReducer;