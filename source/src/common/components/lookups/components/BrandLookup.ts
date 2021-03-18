import { connect } from "react-redux";

import { Bantikom } from 'app/common/core/api/proxy';
import {
    GetNextPage
} from 'app/common/core/data/reducers/pagination-reducer-factory';

import { IStateProps, IDispatchProps, IOwnProps } from "../contracts";
import { Lookup } from "./Lookup";

const BrandLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService.BrandPage
        };
    },
    {
        fetchItems: Bantikom.BrandService.getBrandPage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.BrandService.getBrandPage.clear
    }
)(Lookup);

export { BrandLookupConnected as BrandLookup };
