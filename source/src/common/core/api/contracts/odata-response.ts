export interface IODataResponse {
    status: number;
    statusText: string;
    url: string;
    context: string;
}

export interface ISingleODataResponse<TData> extends IODataResponse {
    item: TData;
}

export interface IMultipleODataResponse<TData> extends IODataResponse {
    count: number;
    items: TData[];
}

export interface IPageableODataResponse<TData> extends IMultipleODataResponse<TData> {
    pageSize: number;
    pageNo: number;
}

export function getODataResponse(response: any): IODataResponse {
    return {
        status: response.status,
        statusText: response.statusText,
        url: response.url || response.config.url,

        context: response.data ? response.data['@odata.context'] : response.context ? response.context : null
    } as IODataResponse;
}

export function getSingleODataResponse<TData>(response: any): ISingleODataResponse<TData> {
    return {
        ...getODataResponse(response),
        
        item: response.data || response.item
    } as ISingleODataResponse<TData>;
}

export function getMultipleODataResponse<TData>(response: any): IMultipleODataResponse<TData> {
    return {
        ...getODataResponse(response),

        count: response.data['@odata.count'],
        items: response.data.value
    } as IMultipleODataResponse<TData>;
}

export function getPageODataResponse<TData>(response: any): IPageableODataResponse<TData> {
    return {
        ...getODataResponse(response),
        pageNo: response.pageNo,
        pageSize: response.pageSize,

        count: response.data['@odata.count'],
        items: response.data.value
    } as IPageableODataResponse<TData>;
}