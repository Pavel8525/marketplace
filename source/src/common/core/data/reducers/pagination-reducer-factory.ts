import { Action } from "redux";

import { AxiosClient } from 'app/common/core/transport/axios-client';
import { paginationPageSizeMax } from "app/common/constants";

import { IFetchable } from '../contracts/IFetchable';

export interface IPaginationState<TItem, TFilter, TData = object> extends IFetchable {
    filter?: TFilter;
    prepareResponse?: (response: IResponsePayload<TItem>) => IResponsePayload<TItem>;
    pageNo: number;
    pageSize: number;

    count?: number;
    items?: TItem[];
    data?: TData;
}

export interface IPrepareResponse<TItem> {
    callback: (response: IResponsePayload<TItem>) => IResponsePayload<TItem>;
}

export type GetNextPage<TFilter> = (filter: TFilter, pageNo?: number, pageSize?: number) => Promise<void>;
export type SetFilter<TFilter> = (filter: TFilter) => void;
export type SetPrepareResponse<TItem> = (prepareResponse: IPrepareResponse<TItem>) => void;

export interface IGetNextPageAction {
    types: string[];
    promise: (client: AxiosClient) => Promise<void | object>;
}

export interface IPageableOperation<TItem, TFilter> {
    getNextPage: (request: TFilter, pageNo?: number, pageSize?: number) => void | IGetNextPageAction | Promise<void>;
    setFilter: (filter: TFilter) => void;
    setPrepareResponse: (prepareResponse: IPrepareResponse<TItem>) => void;
    paginationReducer: (state: IPaginationState<TItem, TFilter>, action: IAction<TItem, TFilter>) => IPaginationState<TItem, TFilter>;
    clear: () => void;
}

interface IFilterPayload<TFilter> {
    filter?: TFilter;
}

export interface IResponsePayload<TItem> {
    pageNo?: number;
    pageSize: number;
    count: number;
    items: TItem[];
}

interface IPageableRequest {
    pageSize?: number;
    pageNo?: number;
}

interface IAction<TItem, TFilter> extends Action {
    payload?: IFilterPayload<TFilter> | IResponsePayload<TItem>;
}

const paginationReducerFactory = <TItem, TFilter extends {}>(
    actionNamePrefix: string,
    nextPageUrl: string,
    options: { pageSize: number } = { pageSize: paginationPageSizeMax },
    infinite: boolean = true,
    mainTransform?: (data: {}) => TItem,
    onClear?: () => void
): IPageableOperation<TItem, TFilter> => {

    const SET_FILTER = actionNamePrefix + "/SET_FILTER";
    const SET_PREPARE_RESPONSE = actionNamePrefix + "/SET_PREPARE_RESPONSE";
    const CLEAR = actionNamePrefix + "/CLEAR";
    const GET_NEXT_PAGE = actionNamePrefix + "/GET_NEXT_PAGE";
    const GET_NEXT_PAGE_SUCCESS = GET_NEXT_PAGE + "_SUCCESS";
    const GET_NEXT_PAGE_ERROR = GET_NEXT_PAGE + "_ERROR";

    const initialState: IPaginationState<TItem, TFilter> = {
        fetching: false,
        failed: false,

        filter: null,
        prepareResponse: null,
        pageNo: 0,
        ...options,

        count: null,
        items: null,
        data: null
    };

    const getNextPage = (filter: TFilter, pageNo?: number, pageSize?: number) => ({
        types: [GET_NEXT_PAGE, GET_NEXT_PAGE_SUCCESS, GET_NEXT_PAGE_ERROR],
        promise: (client: AxiosClient) => {
            return client.getPage(
                nextPageUrl,
                {
                    data: {
                        params: { ...filter },
                        pageNo: pageNo === undefined
                            ? (filter as IPageableRequest).pageNo
                            : pageNo,
                        pageSize: pageSize === undefined
                            ? (filter as IPageableRequest).pageSize
                            : pageSize
                    }
                }
            );
        }
    });

    const setFilter = (filter: TFilter) => ({
        terminateAsyncType: GET_NEXT_PAGE,
        type: SET_FILTER,
        payload: { filter }
    });

    const clear = () => ({
        terminateAsyncType: GET_NEXT_PAGE,
        type: CLEAR
    });

    const paginationReducer = (state = initialState, action: IAction<TItem, TFilter> = { type: null }) => {
        switch (action.type) {
            case SET_FILTER:
                return {
                    ...initialState,
                    filter: (action.payload as IFilterPayload<TFilter>).filter
                };
            case SET_PREPARE_RESPONSE: {
                return {
                    ...state,
                    prepareResponse: action.payload as (response: IResponsePayload<TItem>) => IResponsePayload<TItem>
                };
            }
            case GET_NEXT_PAGE:
                return { ...state, fetching: true };

            case GET_NEXT_PAGE_SUCCESS: {
                let payload = (mainTransform
                    ? mainTransform(action.payload)
                    : action.payload) as IResponsePayload<TItem>;

                if (state.prepareResponse) {
                    try {
                        payload = state.prepareResponse(payload);
                    } catch (error) {
                        if (error.message !== "Cannot read property 'toString' of null") {
                            throw error;
                        }
                    }
                }

                const pageNo = infinite ? state.pageNo + 1 : payload.pageNo;
                const pageSize: number = (payload.pageSize !== null && payload.pageSize !== undefined)
                    ? payload.pageSize
                    : (payload as any).pageSize;

                const count: number = (payload.count !== null && payload.count !== undefined)
                    ? payload.count
                    : (payload as any).count;

                const items: TItem[] = payload.items;
                const summaryItems = infinite
                    ? items
                        ? [...(state.items || []), ...items]
                        : null
                    : [...items];

                return {
                    ...state,
                    pageNo: pageNo,
                    pageSize: pageSize > 0 ? pageSize : state.pageSize,
                    fetching: false,
                    count,
                    items: summaryItems,
                    data: payload
                };
            }

            case GET_NEXT_PAGE_ERROR:
                return { ...state, fetching: false, failed: true };

            case CLEAR: {
                if (onClear) {
                    onClear();
                }

                return {
                    ...initialState
                };
            }


            default:
                return state;
        }
    };

    const setPrepareResponse = (prepareResponse: IPrepareResponse<TItem>) => ({
        type: SET_PREPARE_RESPONSE,
        payload: prepareResponse.callback
    });


    return {
        getNextPage,
        setFilter,
        clear,
        paginationReducer,
        setPrepareResponse
    };
};

export { paginationReducerFactory };
