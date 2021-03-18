import { IStoreState } from "app/common/core";
import { connect } from "react-redux";
import { IStateProps, IDispatchProps, CreationWizard } from "../components/CreationWizard";
import { Bantikom } from "app/common/core/api/proxy";
import { Fetch } from "app/common/core/data";

const CreationWizardConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ProductItem
        };
    },
    {
        fetchProductItem: Bantikom.ProductService.getProductItem.fetch as Fetch<{}>,
        clear: Bantikom.ProductService.getProductItem.clear
    }
)(CreationWizard);

export { CreationWizardConnected as CreationWizard };
