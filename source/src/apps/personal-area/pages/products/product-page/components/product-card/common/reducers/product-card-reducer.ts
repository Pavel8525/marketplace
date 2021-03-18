import {
    getODataResponse,
    getSingleODataResponse,
    IODataResponse,
    ISingleODataResponse
} from "app/common/core/api/contracts/odata-response";
import { Bantikom } from "app/common/core/api/proxy";
import { fetchReducerFactory, storeReducerFactory } from "app/common/core/data";

const productCardFetchReducerCreator = (reducerKey: string) => {
    const reducerFactory: any = fetchReducerFactory<ISingleODataResponse<Bantikom.Product>, {}>(
        `get:ProductItem:${reducerKey}`,
        "/Product",
        (response => getSingleODataResponse<Bantikom.Product>(response)),
        false
    );

    reducerFactory.reducer = reducerFactory.fetchReducer;
    return reducerFactory;
}

const productCardStoreReducerCreator = (reducerKey: string) => {
    const reducerFactory: any = storeReducerFactory<IODataResponse, {}>(
        `save:ProductItem:${reducerKey}`,
        "patch",
        "/Product",
        (response => getODataResponse(response))
    );

    reducerFactory.reducer = reducerFactory.reducer;
    return reducerFactory;
}

export {
    productCardFetchReducerCreator,
    productCardStoreReducerCreator
};
