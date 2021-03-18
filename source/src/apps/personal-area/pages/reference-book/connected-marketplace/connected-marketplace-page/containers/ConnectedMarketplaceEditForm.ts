import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { InvokeSpecificUrl } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    ConnectedMarketplaceEditForm,
    IStateProps,
    IDispatchProps
} from "../components/ConnectedMarketplaceEditForm";

const ConnectedMarketplaceEditFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ConnectedMarketplaceItem
        };
    },
    {
        saveItem: Bantikom.ConnectedMarketplaceService.saveConnectedMarketplaceItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyItem: Bantikom.ConnectedMarketplaceService.getConnectedMarketplaceItem.updateLocally
    }
)(ConnectedMarketplaceEditForm);

export { ConnectedMarketplaceEditFormConnected as ConnectedMarketplaceEditForm };
