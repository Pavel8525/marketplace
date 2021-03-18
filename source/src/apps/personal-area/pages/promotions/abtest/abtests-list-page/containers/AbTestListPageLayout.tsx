import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { AbTestsListPage, IStateProps, IDispatchProps } from "../components/AbTestsListPage";

const AbTestsListPageWithTranslation = withTranslation()(AbTestsListPage);
const AbTestsListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(AbTestsListPageWithTranslation);

export {
    AbTestsListPageConnected as AbTestsListPageLayout
};
