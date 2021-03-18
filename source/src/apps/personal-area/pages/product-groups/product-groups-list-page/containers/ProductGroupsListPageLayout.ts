import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { ProductGroupsListPage, IStateProps, IDispatchProps } from "../components/ProductGroupsListPage";

const ProductGroupsListPageWithTranslation = withTranslation()(ProductGroupsListPage);
const ProductGroupsListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings
        };
    },
    {
    }
)(ProductGroupsListPageWithTranslation);

export {
    ProductGroupsListPageConnected as ProductGroupsListPageLayout
};
