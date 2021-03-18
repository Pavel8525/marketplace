import { connect } from "react-redux";

import { BantikomExt } from "app/common/core/api/proxy-ext";
import { Fetch, InvokeSpecificUrl } from "app/common/core/data";

import {
    ProductCard,
    IStateProps,
    IDispatchProps
} from "../components/ProductCard";
import { Bantikom } from "app/common/core/api/proxy";

const ProductCardConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            exportProductState: state.odataService.SearchImportedProductService_ExportProductResponse,
            allMarketPlaces: state.odataService.MarketPlaceItems,
        };
    },
    {
        getProductLinks: BantikomExt.ProductService.getProductLinks.fetch as Fetch<{}>,
        clearProductLinks: BantikomExt.ProductService.getProductLinks.clear,
        setConnectedMarketplace: BantikomExt.ProductService.setConnectedMarketplace.invoke as InvokeSpecificUrl<{}, {}>,
        getAllMarketPlaces: Bantikom.MarketPlaceService.getMarketPlaceItems.fetch as Fetch<{}>
    }
)(ProductCard);

export {
    ProductCardConnected as ProductCard
};
