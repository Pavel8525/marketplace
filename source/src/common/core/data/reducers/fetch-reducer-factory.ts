import { Action } from 'redux';

import { AxiosClient } from 'app/common/core/transport/axios-client';
import { IFetchable } from '../contracts/IFetchable';

class Error {
    public status: number;
}

export interface IFetchState<TData, TRequest = {}> extends IFetchable {
    request: TRequest;
    data: TData;
    error: Error;
}

interface IAction<TRequest, TResponse> extends Action {
    request: TRequest;
    payload?: TResponse;
    transform?: (data: TResponse) => TResponse;
    error?: Error;
}

export interface IFactoryOptions {
    actionNamePrefix: string;
    fetchUrl: string;
}

export interface IFetchAction {
    types: string[];
    promise: (client: AxiosClient) => Promise<void | object>;
}

type MutationFunction = (options: IFactoryOptions) => IFactoryOptions;

export interface IFetchOperation<TData, TFilter> {
    fetch: (filter: TFilter) => void | IFetchAction | Promise<void>;
    clear: () => void;
    updateLocally: (data: TData) => void;
    fetchReducer: (state: IFetchState<TData>, action: Action) => IFetchState<TData>;
    url: string;
    mutate: (mutation: MutationFunction) => IFetchOperation<TData, TFilter>;
    types: {
        CLEAR: string;
        UPDATE_LOCALLY: string;
        FETCH: string;
        FETCH_SUCCESS: string;
        FETCH_ERROR: string;
    };
}

export type Fetch<TFilter> = (filter: TFilter) => Promise<void>;

export type Clear = () => void;

const factory = <TResponse, TRequest>(
    actionNamePrefix: string,
    fetchUrl: string,
    mainTransform?: (data: TResponse) => TResponse,
    multiple?: boolean): IFetchOperation<TResponse, TRequest> => {

    const initialState: IFetchState<TResponse> = {
        request: null,
        data: null,
        fetching: false,
        failed: false,
        error: null
    };

    const FETCH = actionNamePrefix + "/FETCH";
    const FETCH_SUCCESS = FETCH + "_SUCCESS";
    const FETCH_ERROR = FETCH + "_ERROR";
    const UPDATE_LOCALLY = actionNamePrefix + "/UPDATE_LOCALLY";
    const CLEAR = actionNamePrefix + "/CLEAR";

    const fetch = (request: TRequest, transform: (data: TResponse) => TResponse) => {
        return {
            types: [FETCH, FETCH_SUCCESS, FETCH_ERROR],
            promise: (client: AxiosClient) => {
                if (multiple) {
                    request = { ...request, count: true };
                }
                return client.get(fetchUrl, { params: request });
            },
            transform,
            request
        };
    }

    const updateLocally = (data: TResponse, transform?: (data: TResponse) => TResponse) => ({
        type: UPDATE_LOCALLY,
        payload: data,
        transform
    });

    const clear = () => ({
        terminateAsyncType: FETCH,
        type: CLEAR
    });

    const applyTransform = (data: TResponse, transform: (d: TResponse) => TResponse): TResponse => {
        if (transform) {
            return transform(data);
        }

        return data;
    };

    const fetchReducer = (state = initialState, action: Action = { type: null }) => {
        switch (action.type) {
            case FETCH:
                return { ...state, request: (action as IAction<TRequest, TResponse>).request, fetching: true };

            case FETCH_SUCCESS:
                return {
                    ...initialState,
                    request: state.request,
                    data: applyTransform(
                        (action as IAction<TRequest, TResponse>).payload,
                        (action as IAction<TRequest, TResponse>).transform || mainTransform
                    )
                };

            case FETCH_ERROR:
                return { ...initialState, failed: true, error: (action as IAction<TRequest, TResponse>).error };

            case UPDATE_LOCALLY:
                return {
                    ...initialState,
                    data: applyTransform(
                        (action as IAction<TRequest, TResponse>).payload,
                        (action as IAction<TRequest, TResponse>).transform
                    )
                };

            case CLEAR:
                return { ...initialState };

            default:
                return state;
        }
    };

    return {
        fetch,
        clear,
        updateLocally,
        fetchReducer,
        url: fetchUrl,
        mutate: (mutation) => {
            const options = mutation({ actionNamePrefix, fetchUrl });
            return factory(options.actionNamePrefix, options.fetchUrl);
        },
        types: {
            CLEAR,
            FETCH,
            FETCH_SUCCESS,
            FETCH_ERROR,
            UPDATE_LOCALLY
        }
    };
};

export { factory as fetchReducerFactory };
