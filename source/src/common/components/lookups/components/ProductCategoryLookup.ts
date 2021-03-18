import { connect } from "react-redux";

import { Bantikom } from 'app/common/core/api/proxy';
import {
    GetNextPage
} from 'app/common/core/data/reducers/pagination-reducer-factory';

import { IStateProps, IDispatchProps, IOwnProps } from "../contracts";
import { Lookup } from "./Lookup";

const ProductCategoryLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService.InternalCategoryPage
        };
    },
    {
        fetchItems: Bantikom.InternalCategoryService.getInternalCategoryPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.InternalCategoryService.getInternalCategoryPage.clear
    }
)(Lookup);

export { ProductCategoryLookupConnected as ProductCategoryLookup };