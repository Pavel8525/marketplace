import { connect } from "react-redux";

import { InvokeSpecificUrl, Fetch } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";

import { IStateProps, IDispatchProps, ConfirmationForm } from "../components/ConfirmationForm";
import { BantikomExt } from "app/common/core/api/proxy-ext";
import { Bantikom } from "app/common/core/api/proxy";

const ConfirmationFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            allMarketPlaces: state.odataService.MarketPlaceItems,
            environmentSettings: state.environmentSettings,
            importProductState: state.odataService.SearchImportedProductService_ImportProductResponse
        };
    },
    {
        getAllMarketPlaces: Bantikom.MarketPlaceService.getMarketPlaceItems.fetch as Fetch<{}>,
        invokeImportProduct: BantikomExt.SearchImportedProductService.importProduct.invoke as InvokeSpecificUrl<{}, {}>,
        clear: BantikomExt.SearchImportedProductService.importProduct.reset
    }
)(ConfirmationForm);

export {
    ConfirmationFormConnected as ConfirmationForm
};
