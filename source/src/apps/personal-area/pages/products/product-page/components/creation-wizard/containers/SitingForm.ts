import { connect } from "react-redux";

import { IStateProps, IDispatchProps, SitingForm } from "../components/SitingForm";
import { IStoreState } from "app/common/core";
import { Fetch, InvokeSpecificUrl } from "app/common/core/data";
import { BantikomExt } from "app/common/core/api/proxy-ext";

const SitingFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            createMarketplaceProductsState: state.odataService.ProductService_CreateMarketplaceProducts
        };
    },
    {
        createMarketplaceProducts: BantikomExt.ProductService.createMarketplaceProducts.invoke as InvokeSpecificUrl<{}, {}>,
        getProductLinks: BantikomExt.ProductService.getProductLinks.fetch as Fetch<{}>
    }
)(SitingForm);

export { SitingFormConnected as SitingForm };
