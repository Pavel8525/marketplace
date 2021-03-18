import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Bantikom } from "app/common/core/api/proxy";
import { Fetch } from "app/common/core/data";

import { WatchingProductPage, IStateProps, IDispatchProps } from "../components/WatchingProductPage";

const WatchingProductPageWithTranslation = withTranslation()(WatchingProductPage);
const WatchingProductPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemProductState: state.odataService.WatchingProductLinkItem,
            productLinksState: state.odataService.ProductService_GetProductLinks
        };
    },
    {
        fetchProductItem: Bantikom.WatchingProductLinkService.getWatchingProductLinkItem.fetch as Fetch<{}>
    }
)(WatchingProductPageWithTranslation);

export { WatchingProductPageConnected as WatchingProductPageLayout };