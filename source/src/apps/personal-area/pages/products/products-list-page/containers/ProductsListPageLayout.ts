import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { ProductsListPage, IStateProps, IDispatchProps } from "../components/ProductsListPage";

const ProductsListPageWithTranslation = withTranslation()(ProductsListPage);
const ProductsListPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            items: state.odataService.ProductPage
        };
    },
    {
    }
)(ProductsListPageWithTranslation);

export { ProductsListPageConnected as ProductsListPageLayout };