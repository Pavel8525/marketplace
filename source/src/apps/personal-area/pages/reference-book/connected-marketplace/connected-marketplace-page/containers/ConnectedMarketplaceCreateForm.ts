import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { Bantikom } from "app/common/core/api/proxy";
import { Invoke } from "app/common/core/data";

import { IStateProps, IDispatchProps, ConnectedMarketplaceCreateForm } from "../components/ConnectedMarketplaceCreateForm";

const ConnectedMarketplaceCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ConnectedMarketplaceItem
        };
    },
    {
        createItem: Bantikom.ConnectedMarketplaceService.createConnectedMarketplaceItem.invoke as Invoke<{}, {}>
    }
)(ConnectedMarketplaceCreateForm);

export { ConnectedMarketplaceCreateFormConnected as ConnectedMarketplaceCreateForm };