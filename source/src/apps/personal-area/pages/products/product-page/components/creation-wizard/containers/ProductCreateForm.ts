import { connect } from "react-redux";
import { IStateProps, IDispatchProps, ProductCreateForm } from "../components/ProductCreateForm";
import { IStoreState } from "app/common/core";
import { Bantikom } from "app/common/core/api/proxy";
import { Invoke } from "app/common/core/data";

const ProductCreateFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ProductItem
        };
    },
    {
        createItem: Bantikom.ProductService.createProductItem.invoke as Invoke<{}, {}>
    }
)(ProductCreateForm);

export { ProductCreateFormConnected as ProductCreateForm };
