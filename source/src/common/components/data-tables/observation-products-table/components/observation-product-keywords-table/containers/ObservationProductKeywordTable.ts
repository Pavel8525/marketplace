import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    GetNextPage,
    InvokeSpecificUrl,
    SetFilter
} from "app/common/core/data";
import { getOrAddAsyncReducer } from 'app/common/core/store/configure';
import { getBatchReducerCreator, getBatchServiceReduxKey } from "app/common/core/api/reducers/batch";
import { getPaginationReducerCreator } from "app/common/core/api/reducers/pagination";

import {
    IDispatchProps,
    IOwnProps,
    IStateProps,
    ObservationProductKeywordsTable
} from "../components/ObservationProductKeywordsTable";

const getPaginationReduxKey = (key: string): string => `ObservationProductKeywordPage_${key}`;
const paginationReducerCreator = (key: string) => getPaginationReducerCreator(key, 'ObservationProductKeyword');

const ObservationProductKeywordsTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any, props: IOwnProps) => {
        const paginationReducerKey = getPaginationReduxKey(props.observationProductId);
        const saveReducerKey = getBatchServiceReduxKey(props.observationProductId);

        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService[paginationReducerKey] || getOrAddAsyncReducer(paginationReducerKey, paginationReducerCreator).paginationReducer,
            saveState: state.odataService[saveReducerKey] || getOrAddAsyncReducer(saveReducerKey, getBatchReducerCreator).reducer
        };
    },
    (dispatch: any, props: IOwnProps): IDispatchProps => {
        const paginationReducerKey = getPaginationReduxKey(props.observationProductId);
        const saveReducerKey = getBatchServiceReduxKey(props.observationProductId);

        return {
            setFilterItems: bindActionCreators(getOrAddAsyncReducer(paginationReducerKey, paginationReducerCreator).setFilter as SetFilter<{}>, dispatch),
            fetchItems: bindActionCreators(getOrAddAsyncReducer(paginationReducerKey, paginationReducerCreator).getNextPage as GetNextPage<{}>, dispatch),
            clear: bindActionCreators(getOrAddAsyncReducer(paginationReducerKey, paginationReducerCreator).clear, dispatch),
            save: bindActionCreators(getOrAddAsyncReducer(saveReducerKey, getBatchReducerCreator).invoke as InvokeSpecificUrl<{}, {}>, dispatch)
        }
    }
)(ObservationProductKeywordsTable);

export {
    ObservationProductKeywordsTableConnected as ObservationProductKeywordsTable
};
