import {Dispatch, useReducer} from 'react';
import { AnyAction } from 'redux'
import { AxiosClient } from 'app/common/core/transport/axios-client';
import { makeReducer, makeTypes, Types } from 'app/common/helpers/redux-helper';
import {DataProcessLookupConfig} from "app/common/components";

const api = new AxiosClient();

interface State {
    fetching: boolean;
    items: any[];
    error: any;
}
export const getCategoryInfo = (url: string, params: object) => api.getPage(url, params)
export const getCategories = (url: string, params: object) => api.get(url, params)

const fetchItemsThunk = (config: DataProcessLookupConfig, types: Types, dispatch: Dispatch<AnyAction>) => async (filter: any) => {
    try {
        dispatch({ type: types.fetching })
        const res = await getCategoryInfo(config.apiUrl, config.request(filter));
        dispatch({ type: types.success, payload: res.data.value || [] })
    } catch (e) {
        dispatch({ type: types.failure, payload: e })
    }
}

const initialState: State = {
    fetching: false,
    items: [],
    error: null,
}

export const useFetching = (prefix: string, config: DataProcessLookupConfig) => {
    const types = makeTypes(`FETCH_CATEGORIES_${prefix}`);

    const actionHandler = {
        [types.fetching]: (state: State) => ({
            ...state,
            fetching: true
        }),
        [types.success]: (state: State, action: AnyAction) => ({
            ...state,
            fetching: false,
            items: action.payload
        }),
        [types.failure]: (state: State, action: AnyAction) => ({
            ...initialState,
            error: action.payload
        })
    }

    const reducer = makeReducer(actionHandler);

    const [state, dispatch] = useReducer(reducer, initialState)

    return [state, fetchItemsThunk(config, types, dispatch)]
}
