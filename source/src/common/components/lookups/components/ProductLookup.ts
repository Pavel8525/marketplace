import { connect } from "react-redux";

import { Bantikom } from 'app/common/core/api/proxy';
import {
    GetNextPage
} from 'app/common/core/data/reducers/pagination-reducer-factory';

import { IStateProps, IDispatchProps, IOwnProps } from "../contracts";
import { Lookup } from "./Lookup";

const ProductLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService.ProductPage
        };
    },
    {
        fetchItems: Bantikom.ProductService.getProductPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.ProductService.getProductPage.clear
    }
)(Lookup);

export { ProductLookupConnected as ProductLookup };
