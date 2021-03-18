import {
    getODataResponse,
    getSingleODataResponse,
    IODataResponse,
    ISingleODataResponse
} from "app/common/core/api/contracts/odata-response";
import { AbTestVariation } from "app/common/core/api/proxy-ext";
import { fetchReducerFactory, storeReducerFactory } from "app/common/core/data";

const abTestVariationFetchReducerCreator = (reducerKey: string) => {
    const reducerFactory: any = fetchReducerFactory<ISingleODataResponse<AbTestVariation>, {}>(
        `get:AbTestVariationItem:${reducerKey}`,
        "/AbTestVariation",
        (response => getSingleODataResponse<AbTestVariation>(response)),
        false
    );

    reducerFactory.reducer = reducerFactory.fetchReducer;
    return reducerFactory;
}

const abTestVariationStoreReducerCreator = (reducerKey: string) => {
    const reducerFactory: any = storeReducerFactory<IODataResponse, {}>(
        `save:AbTestVariationItem:${reducerKey}`,
        "patch",
        "/AbTestVariation",
        (response => getODataResponse(response))
    );

    reducerFactory.reducer = reducerFactory.reducer;
    return reducerFactory;
}

export {
    abTestVariationFetchReducerCreator,
    abTestVariationStoreReducerCreator
};
