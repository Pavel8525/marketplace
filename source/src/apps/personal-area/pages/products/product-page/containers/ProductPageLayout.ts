import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { Fetch } from "app/common/core/data";

import { ProductPage, IStateProps, IDispatchProps } from "../components/ProductPage";
import { BantikomExt } from "app/common/core/api/proxy-ext";

const ProductPageWithTranslation = withTranslation()(ProductPage);
const ProductPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            productLinksState: state.odataService.ProductService_GetProductLinks
        };
    },
    {
        getProductLinks: BantikomExt.ProductService.getProductLinks.fetch as Fetch<{}>,
        clearProductLinks: BantikomExt.ProductService.getProductLinks.clear
    }
)(ProductPageWithTranslation);

export { ProductPageConnected as ProductPageLayout };