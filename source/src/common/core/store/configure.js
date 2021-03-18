import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers
} from 'redux';

import thunk from 'redux-thunk';

import { clientMiddleware } from './clientMiddleware';
import { AxiosClient } from 'app/common/core/transport/axios-client';
import { createModuleReducers } from '../../reducers';

function createReducer(asyncReducers) {
    const moduleReducers = createModuleReducers(asyncReducers);
    var importedReducers = {
        ...moduleReducers
    };

    var reducers = combineReducers(importedReducers);
    return reducers;
}

function createReduxStore() {
    const client = new AxiosClient();

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const enhancer = composeEnhancers(
        applyMiddleware(thunk),
        applyMiddleware(clientMiddleware(client))
    )(createStore);

    const reducers = createReducer();
    const initialState = window.__data;

    const store = enhancer(reducers, initialState);
    store.asyncReducers = {};

    return store;
}

export const store = createReduxStore();

function injectAsyncReducer(store, name, asyncReducer) {
    store.asyncReducers[name] = asyncReducer;
    const newReducers = createReducer(store.asyncReducers);
    store.replaceReducer(newReducers);
}

const asynReducers = new Map();

export function getOrAddAsyncReducer(reducerKey, reducerCreator) {
    let reducerFactory = asynReducers.get(reducerKey);
    
    if (reducerFactory == null && reducerCreator) {
        reducerFactory = reducerCreator(reducerKey);

        injectAsyncReducer(store, reducerKey, reducerFactory.reducer);

        asynReducers.set(reducerKey, reducerFactory);
    }

    return reducerFactory;
}