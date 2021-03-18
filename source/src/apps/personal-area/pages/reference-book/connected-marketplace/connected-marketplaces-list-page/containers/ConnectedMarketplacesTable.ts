import { connect } from "react-redux";

import { SetFilter, SetPrepareResponse, GetNextPage } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    IStateProps,
    IDispatchProps,
    IOwnProps,
    ConnectedMarketplacesTable
} from "../components/ConnectedMarketplacesTable";

const ConnectedMarketplacesTableConnected = connect<IStateProps, IDispatchProps, IOwnProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.ConnectedMarketplacePage
        };
    },
    {
        setFilterItems: Bantikom.ConnectedMarketplaceService.getConnectedMarketplacePage.setFilter as SetFilter<{}>,
        setPrepareResponseSchemes: Bantikom.ConnectedMarketplaceService.getConnectedMarketplacePage.setPrepareResponse as SetPrepareResponse<{}>,
        fetchItems: Bantikom.ConnectedMarketplaceService.getConnectedMarketplacePage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.ConnectedMarketplaceService.getConnectedMarketplacePage.clear
    }
)(ConnectedMarketplacesTable);

export { ConnectedMarketplacesTableConnected as ConnectedMarketplacesTable };
