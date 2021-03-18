import { connect } from "react-redux";

import { IStoreState } from "app/common/core";
import { InvokeSpecificUrl } from "app/common/core/data";
import { Bantikom } from "app/common/core/api/proxy";

import {
    ProductGroupEditForm,
    IStateProps,
    IDispatchProps
} from "../components/ProductGroupEditForm";

const ProductGroupEditFormConnected = connect<IStateProps, IDispatchProps>(
    (state: IStoreState) => {
        return {
            itemState: state.odataService.ProductGroupItem
        };
    },
    {
        saveItem: Bantikom.ProductGroupService.saveProductGroupItem.invoke as InvokeSpecificUrl<{}, {}>,
        updateLocallyItem: Bantikom.ProductGroupService.getProductGroupItem.updateLocally
    }
)(ProductGroupEditForm);

export { ProductGroupEditFormConnected as ProductGroupEditForm };
