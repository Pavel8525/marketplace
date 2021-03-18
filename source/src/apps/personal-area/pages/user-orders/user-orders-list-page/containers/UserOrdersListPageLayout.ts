import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { UserOrdersListPage, IStateProps, IDispatchProps } from "../components/UserOrdersListPage";

const UserOrdersListPageWithTranslation = withTranslation()(UserOrdersListPage);
const UserOrdersListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(UserOrdersListPageWithTranslation);

export {
    UserOrdersListPageConnected as UserOrdersListPageLayout
};
