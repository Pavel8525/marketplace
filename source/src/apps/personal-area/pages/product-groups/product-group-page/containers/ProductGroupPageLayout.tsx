import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import { ProductGroupPage, IStateProps, IDispatchProps } from "../components/ProductGroupPage";
import { Bantikom } from "app/common/core/api/proxy";
import { Clear, Fetch } from "app/common/core/data";

const ProductGroupPageWithTranslation = withTranslation()(ProductGroupPage);
const ProductGroupPageConnected = connect<IStateProps, IDispatchProps>(
    (state: any) => {
        return {
            environmentSettings: state.environmentSettings,
            itemState: state.odataService.ProductGroupItem
        };
    },
    {
        fetchItem: Bantikom.ProductGroupService.getProductGroupItem.fetch as Fetch<{}>,
        clear: Bantikom.ProductGroupService.getProductGroupItem.clear as Clear
    }
)(ProductGroupPageWithTranslation);

export {
    ProductGroupPageConnected as ProductGroupPageLayout
};
