import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { IStoreState } from "app/common/core";
import { Clear, Fetch, InvokeSpecificUrl } from "app/common/core/data";
import { getOrAddAsyncReducer } from 'app/common/core/store/configure';

import {
    IOwnProps,
    IStateProps,
    IDispatchProps,
    VariationForm
} from "../components/VariationForm";
import {
    abTestVariationFetchReducerCreator,
    abTestVariationStoreReducerCreator
} from "../reducers/variation-form-reducer";

const getKey = (operation: string, itemId: string) => `AbTestVariationItem:${operation}:${itemId}`;

const VariationFormConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: IStoreState, props: IOwnProps) => {
        const reducerKey = getKey('fetch', props.initItem.Id);
        const itemState = state.odataService[reducerKey] || getOrAddAsyncReducer(reducerKey, abTestVariationFetchReducerCreator).fetchReducer

        return {
            environmentSettings: state.environmentSettings,
            itemState
        };
    },
    (dispatch: any, props: IOwnProps): IDispatchProps => {
        const reducerKey = getKey('fetch', props.initItem.Id);

        return {
            fetchItem: bindActionCreators(getOrAddAsyncReducer(reducerKey, abTestVariationStoreReducerCreator).fetch as Fetch<{}>, dispatch),
            saveItem: bindActionCreators(getOrAddAsyncReducer(getKey('invoke', props.initItem.Id), abTestVariationStoreReducerCreator).invoke as InvokeSpecificUrl<{}, {}>, dispatch),
            updateLocallyItem: bindActionCreators(getOrAddAsyncReducer(reducerKey, abTestVariationFetchReducerCreator).updateLocally, dispatch),
            clear: bindActionCreators(getOrAddAsyncReducer(reducerKey, abTestVariationFetchReducerCreator).clear as Clear, dispatch)
        };
    }
)(VariationForm);

export { VariationFormConnected as VariationForm };
