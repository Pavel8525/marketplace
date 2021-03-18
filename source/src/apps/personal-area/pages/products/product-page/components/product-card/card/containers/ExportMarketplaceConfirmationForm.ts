import { connect } from "react-redux";

import { InvokeSpecificUrl } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";

import { IStateProps, IDispatchProps, ExportMarketplaceConfirmationForm } from "../components/ExportMarketplaceConfirmationForm";
import { BantikomExt } from "app/common/core/api/proxy-ext";

const ExportMarketplaceConfirmationFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            environmentSettings: state.environmentSettings,
            exportProductState: state.odataService.SearchImportedProductService_ExportProductResponse
        };
    },
    {
        exportProduct: BantikomExt.SearchImportedProductService.exportProduct.invoke as InvokeSpecificUrl<{}, {}>,
        clear: BantikomExt.SearchImportedProductService.exportProduct.reset 
    }
)(ExportMarketplaceConfirmationForm);

export {
    ExportMarketplaceConfirmationFormConnected as ExportMarketplaceConfirmationForm
};
