import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { ConnectedMarketplacesListPage, IStateProps, IDispatchProps } from "../components/ConnectedMarketplacesListPage";

const ConnectedMarketplacesListPageWithTranslation = withTranslation()(ConnectedMarketplacesListPage);
const ConnectedMarketplacesListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(ConnectedMarketplacesListPageWithTranslation);

export { ConnectedMarketplacesListPageConnected as ConnectedMarketplacesListPageLayout };