import { connect } from "react-redux";

import { InvokeSpecificUrl } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";

import { IStateProps, IDispatchProps, MarketplaceProductCreateForm } from "../components/MarketplaceProductCreateForm";
import { BantikomExt } from "app/common/core/api/proxy-ext";

const MarketplaceProductCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            environmentSettings: state.environmentSettings,
            createMarketplaceProductState: state.odataService.ProductService_CreateMarketplaceProduct
        };
    },
    {
        createMarketplaceProduct: BantikomExt.ProductService.createMarketplaceProduct.invoke as InvokeSpecificUrl<{}, {}>,
        clear: BantikomExt.ProductService.createMarketplaceProduct.reset
    }
)(MarketplaceProductCreateForm);

export {
    MarketplaceProductCreateFormConnected as MarketplaceProductCreateForm
};
