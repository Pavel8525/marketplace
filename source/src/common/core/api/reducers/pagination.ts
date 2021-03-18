import { paginationReducerFactory } from "../../data";
import { getPageODataResponse, IPageableODataResponse } from "../contracts/odata-response";

export const getPaginationReducerCreator = <T>(reducerKey: string, entityName: string) => {
    const reducerFactory: any = paginationReducerFactory<IPageableODataResponse<T>, {}>(
        `get:${reducerKey}`,
        `/${entityName}`,
        undefined,
        false,
        (response => getPageODataResponse<T>(response))
    );

    reducerFactory.reducer = reducerFactory.paginationReducer;
    return reducerFactory;
}
