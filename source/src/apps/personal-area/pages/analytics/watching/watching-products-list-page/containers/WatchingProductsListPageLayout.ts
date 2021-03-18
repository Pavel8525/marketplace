import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { WatchingProductsListPage, IStateProps, IDispatchProps } from "../components/WatchingProductsListPage";

const WatchingProductsListPageWithTranslation = withTranslation()(WatchingProductsListPage);
const WatchingProductsListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(WatchingProductsListPageWithTranslation);

export { WatchingProductsListPageConnected as WatchingProductsListPageLayout };