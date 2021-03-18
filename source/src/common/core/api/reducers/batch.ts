import { storeReducerFactory } from "../../data";
import { getSingleODataResponse, ISingleODataResponse } from "../contracts/odata-response";

export const getBatchServiceReduxKey = (key: string): string => `BatchService_Batch_${key}`;

export const getBatchReducerCreator = (reducerKey: string) => {
    const reducerFactory: any = storeReducerFactory<ISingleODataResponse<{}>, {}>(
        `action:Batch:${reducerKey}`,
        "post",
        "/$batch",
        (response => getSingleODataResponse<{}>(response))
    );

    reducerFactory.reducer = reducerFactory.reducer;
    return reducerFactory;
}
