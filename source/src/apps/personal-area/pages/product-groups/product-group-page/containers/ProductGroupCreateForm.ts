import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { Bantikom } from "app/common/core/api/proxy";
import { Invoke } from "app/common/core/data";

import { IStateProps, IDispatchProps, ProductGroupCreateForm } from "../components/ProductGroupCreateForm";

const ProductGroupCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ProductGroupItem
        };
    },
    {
        createItem: Bantikom.ProductGroupService.createProductGroupItem.invoke as Invoke<{}, {}>
    }
)(ProductGroupCreateForm);

export { ProductGroupCreateFormConnected as ProductGroupCreateForm };