import { connect } from "react-redux";

import { Bantikom } from 'app/common/core/api/proxy';
import {
    GetNextPage
} from 'app/common/core/data/reducers/pagination-reducer-factory';

import { IStateProps, IDispatchProps, IOwnProps } from "../contracts";
import { Lookup } from "./Lookup";

const ConnectedMarketplaceLookupConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemsState: state.odataService.ConnectedMarketplacePage
        };
    },
    {
        fetchItems: Bantikom.ConnectedMarketplaceService.getConnectedMarketplacePage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.ConnectedMarketplaceService.getConnectedMarketplacePage.clear
    }
)(Lookup);

export { ConnectedMarketplaceLookupConnected as ConnectedMarketplaceLookup };
