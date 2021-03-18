import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { InvokeSpecificUrl } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    ConnectedMarketplaceEditAuthDataForm,
    IStateProps,
    IDispatchProps
} from "../components/ConnectedMarketplaceEditAuthDataForm";

const ConnectedMarketplaceEditAuthDataFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ConnectedMarketplaceItem
        };
    },
    {
        saveItem: Bantikom.ConnectedMarketplaceService.saveConnectedMarketplaceItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyItem: Bantikom.ConnectedMarketplaceService.getConnectedMarketplaceItem.updateLocally
    }
)(ConnectedMarketplaceEditAuthDataForm);

export { ConnectedMarketplaceEditAuthDataFormConnected as ConnectedMarketplaceEditAuthDataForm };
