import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    GetNextPage, paginationReducerFactory
} from 'app/common/core/data/reducers/pagination-reducer-factory';

import { Bantikom } from "app/common/core/api/proxy";
import { IPageableODataResponse, getPageODataResponse } from "app/common/core/api/contracts/odata-response";
import { getOrAddAsyncReducer } from 'app/common/core/store/configure';

import { IStateProps, IDispatchProps, IOwnProps } from "../contracts";
import { MultiSelectLookup } from "./";
import { Lookup } from "./Lookup";

type AttributeDictionaryValue = Bantikom.AttributeDictionaryValue;

const getLookupName = (key: string): string => `AttributeDictionaryValuePage_${key}`;

const reducerCreator = (reducerKey: string) => {
    const reducerFactory: any = paginationReducerFactory<IPageableODataResponse<AttributeDictionaryValue>, {}>(
        `get:${reducerKey}`,
        "/AttributeDictionaryValue",
        undefined,
        false,
        (response => getPageODataResponse<AttributeDictionaryValue>(response))
    );

    reducerFactory.reducer = reducerFactory.paginationReducer;
    return reducerFactory;
}

const AttributeDictionaryValueLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any, props: IOwnProps) => {
        const reducerKey = getLookupName(props.uniqueIdentifier);
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService[reducerKey] || getOrAddAsyncReducer(reducerKey, reducerCreator).paginationReducer
        };
    },
    (dispatch: any, props: IOwnProps): IDispatchProps => {
        const reducerKey = getLookupName(props.uniqueIdentifier);

        return {
            fetchItems: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).getNextPage as GetNextPage<{}>, dispatch),
            clear: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).clear, dispatch)
        };
    }
)(Lookup);

const MultiSelectAttributeDictionaryValueLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any, props: IOwnProps) => {
        const reducerKey = getLookupName(props.uniqueIdentifier);
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService[reducerKey] || getOrAddAsyncReducer(reducerKey, reducerCreator).paginationReducer
        };
    },
    (dispatch: any, props: IOwnProps): IDispatchProps => {
        const reducerKey = getLookupName(props.uniqueIdentifier);

        return {
            fetchItems: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).getNextPage as GetNextPage<{}>, dispatch),
            clear: bindActionCreators(getOrAddAsyncReducer(reducerKey, reducerCreator).clear, dispatch)
        };
    }
)(MultiSelectLookup);

export {
    AttributeDictionaryValueLookupConnected as AttributeDictionaryValueLookup,
    MultiSelectAttributeDictionaryValueLookupConnected as MultiSelectAttributeDictionaryValueLookup
};
