import { AxiosClient } from 'app/common/core/transport/axios-client';
import { AxiosRequestConfig } from 'axios';

import { Action } from 'redux';
import { Reset } from '../contracts';

export interface IOperationState<TResponse, TRequest = any> {
    request: TRequest;
    data: TResponse;
    success: boolean;
    performing: boolean;
    failed: boolean;
    error: object;
}

export type Invoke<TRequest, TResponse = {}> = (request: TRequest) => Promise<TResponse>;
export type InvokeSpecificUrl<TRequest, TResponse = {}> = (request: TRequest, id: string, query?: {}, requestConfig?: AxiosRequestConfig) => Promise<TResponse>;

export interface IInvokeAction {
    types: string[];
    promise: (client: AxiosClient) => Promise<void | object>;
}

export interface IServiceOperation<TRequest, TResponse> {
    invoke: (request: TRequest, id?: string, query?: {}) => (void | IInvokeAction | Promise<{} | TResponse>);
    reset: Reset;
    reducer: (state: IOperationState<TResponse, TRequest>, action: Action) => IOperationState<TResponse, TRequest>;
    url: string;
    types: {
        RESET: string;
        INVOKE: string;
        SUCCESS: string;
        ERROR: string;
    };
}

interface IAction<TRequest, TResponse> extends Action {
    request: TRequest;
    payload?: TResponse;
    error?: Error;
}

interface IFactoryOptions<TItem, TFilter> {
    actionNamePrefix: string;
    method: "get" | "post" | "patch" | "delete";
    url: string;
}
type MutationFunction<TRequest, TResponse> = (options: IFactoryOptions<TRequest, TResponse>) => IFactoryOptions<TRequest, TResponse>;

export const storeReducerFactory = <TResponse, TRequest>(
    actionNamePrefix: string,
    method: "get" | "post" | "patch" | "delete",
    url: string,
    mainTransform?: (data: TResponse) => TResponse): IServiceOperation<TRequest, TResponse> => {

    const INVOKE = actionNamePrefix + "/INVOKE";
    const SUCCESS = actionNamePrefix + "/SUCCESS";
    const ERROR = actionNamePrefix + "/ERROR";
    const RESET = actionNamePrefix + "/RESET";

    const initialState: IOperationState<TResponse, TRequest> = {
        request: null,
        data: null,
        success: false,
        performing: false,
        failed: false,
        error: null
    };

    const reducer = (state = initialState, action: Action = { type: null }) => {
        switch (action.type) {
            case INVOKE:
                return { ...state, request: (action as IAction<TRequest, TResponse>).request, performing: true, success: false };

            case SUCCESS:
                return {
                    ...initialState,
                    request: state.request,
                    data: mainTransform
                        ? mainTransform((action as IAction<TRequest, TResponse>).payload)
                        : (action as IAction<TRequest, TResponse>).payload,
                    success: true
                };

            case ERROR:
                return { ...initialState, failed: true, error: (action as IAction<TRequest, TResponse>).error };

            case RESET:
                return { ...initialState };

            default:
                return state;
        }
    };

    const invoke = (request: TRequest, id?: string, query?: {}, requestConfig?: AxiosRequestConfig) => ({
        types: [INVOKE, SUCCESS, ERROR],
        promise: (client: AxiosClient) => {
            switch (method) {
                case "get":
                    return client.get(url, { params: request });
                case "post":
                    return client.post(url + (id ? `(${id})` : ''), { params: request, query }, requestConfig);
                case "patch":
                    return client.patch(url + `(${id})`, { params: request, query });
                /*case "delete":
                    return client.del(url, { params: request });*/
            }
        },
        request
    });

    const reset = () => ({
        terminateAsyncType: INVOKE,
        type: RESET
    });

    return {
        invoke,
        reset,
        reducer,
        url,
        types: {
            INVOKE,
            ERROR,
            SUCCESS,
            RESET
        }
    };
};
