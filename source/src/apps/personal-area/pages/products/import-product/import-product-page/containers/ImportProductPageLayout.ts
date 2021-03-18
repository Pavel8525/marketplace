import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Clear, GetNextPage, SetFilter } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";
import { Bantikom } from "app/common/core/api/proxy";

import { IStateProps, IDispatchProps, ImportProductPage } from "../components/ImportProductPage";

const ImportProductPageWithTranslation = withTranslation()(ImportProductPage);
const ImportProductPageConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            environmentSettings: state.environmentSettings,
            itemState: state.odataService.SearchImportedProductInfinitePage,
            connectedMarketplaceState: state.odataService.ConnectedMarketplacePage,
            importProductState: state.odataService.SearchImportedProductService_ImportProductResponse
        };
    },
    {
        setFilter: Bantikom.SearchImportedProductService.getSearchImportedProductInfinitePage.setFilter as SetFilter<{}>,
        fetchItems: Bantikom.SearchImportedProductService.getSearchImportedProductInfinitePage.getNextPage as GetNextPage<{}>,
        clear: Bantikom.SearchImportedProductService.getSearchImportedProductInfinitePage.clear as Clear,
    }
)(ImportProductPageWithTranslation);

export {
    ImportProductPageConnected as ImportProductPageLayout
};
