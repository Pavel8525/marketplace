import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { UserOrderPage, IStateProps, IDispatchProps } from "../components/UserOrderPage";

const UserOrderPageWithTranslation = withTranslation()(UserOrderPage);
const UserOrderPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(UserOrderPageWithTranslation);

export {
    UserOrderPageConnected as UserOrderPageLayout
};
