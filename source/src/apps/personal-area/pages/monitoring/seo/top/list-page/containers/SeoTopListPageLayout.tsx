import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { SeoTopListPage, IStateProps, IDispatchProps } from "../components/SeoTopListPage";

const SeoTopListPageWithTranslation = withTranslation()(SeoTopListPage);
const SeoTopListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(SeoTopListPageWithTranslation);

export {
    SeoTopListPageConnected as SeoTopListPageLayout
};
