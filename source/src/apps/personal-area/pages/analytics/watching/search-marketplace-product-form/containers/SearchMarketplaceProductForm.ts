import { connect } from "react-redux";

import { Fetch, Clear } from "app/common/core/data";
import { IStoreState } from "app/common/core/store";
import { BantikomExt } from "app/common/core/api/proxy-ext";

import { IStateProps, IDispatchProps, SearchMarketplaceProductForm } from "../components/SearchMarketplaceProductForm";


const SearchMarketplaceProductFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.SearchMarketplaceProductService_GetMarketplaceProduct
        };
    },
    {
        searchItems: BantikomExt.SearchMarketplaceProductService.getMarketplaceProduct.fetch as Fetch<{}>,
        clear: BantikomExt.SearchMarketplaceProductService.getMarketplaceProduct.clear as Clear
    }
)(SearchMarketplaceProductForm);

export { SearchMarketplaceProductFormConnected as SearchMarketplaceProductForm };
