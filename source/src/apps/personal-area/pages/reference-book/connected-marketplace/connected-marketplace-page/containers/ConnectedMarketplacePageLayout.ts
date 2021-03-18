import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Bantikom } from "app/common/core/api/proxy";
import { Fetch } from "app/common/core/data";

import { ConnectedMarketplacePage, IStateProps, IDispatchProps } from "../components/ConnectedMarketplacePage";

const ConnectedMarketplacePageWithTranslation = withTranslation()(ConnectedMarketplacePage);
const ConnectedMarketplacePageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemState: state.odataService.ConnectedMarketplaceItem
        };
    },
    {
        fetchItem: Bantikom.ConnectedMarketplaceService.getConnectedMarketplaceItem.fetch as Fetch<{}>
    }
)(ConnectedMarketplacePageWithTranslation);

export { ConnectedMarketplacePageConnected as ConnectedMarketplacePageLayout };
